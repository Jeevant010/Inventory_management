const Asset = require('../models/Asset');
const TowerType = require('../models/towerType');
const SubstationType = require('../models/substationType');
const SKU = require('../models/sku');
const SKUCompatibility = require('../models/SkuCompartibility');

async function overview(req, res, next) {
  try {
    const [towerTypes, substationTypes, skus, skuComps, assets] = await Promise.all([
      TowerType.countDocuments(),
      SubstationType.countDocuments(),
      SKU.countDocuments(),
      SKUCompatibility.countDocuments(),
      Asset.countDocuments()
    ]);
    res.json({ data: { counts: { towerTypes, substationTypes, skus, skuComps, assets } } });
  } catch (e) { next(e); }
}

async function towerBreakdown(req, res, next) {
  try {
    const dist = await Asset.aggregate([
      { $match: { asset_type: 'TOWER' } },
      { $lookup: { from: 'towertypes', localField: 'type_code', foreignField: 'code', as: 'tt' } },
      { $unwind: '$tt' },
      { $group: { _id: { structure_form: '$tt.structure_form', function: '$tt.function' }, count: { $sum: 1 } } },
      { $project: { _id: 0, structure_form: '$_id.structure_form', function: '$_id.function', count: 1 } },
      { $sort: { structure_form: 1, function: 1 } }
    ]);
    res.json({ data: { distribution: dist } });
  } catch (e) { next(e); }
}

async function substationBreakdown(req, res, next) {
  try {
    const dist = await Asset.aggregate([
      { $match: { asset_type: 'SUBSTATION' } },
      { $lookup: { from: 'substationtypes', localField: 'type_code', foreignField: 'code', as: 'st' } },
      { $unwind: '$st' },
      { $group: { _id: { technology: '$st.technology', busbar_scheme: '$st.busbar_scheme' }, count: { $sum: 1 } } },
      { $project: { _id: 0, technology: '$_id.technology', busbar_scheme: '$_id.busbar_scheme', count: 1 } },
      { $sort: { technology: 1, busbar_scheme: 1 } }
    ]);
    res.json({ data: { distribution: dist } });
  } catch (e) { next(e); }
}

async function skuBreakdown(req, res, next) {
  try {
    const dist = await SKU.aggregate([
      { $group: { _id: { category: '$category', cat: '$compatible_asset_type' }, count: { $sum: 1 } } },
      { $project: { _id: 0, category: '$_id.category', compatible_asset_type: '$_id.cat', count: 1 } },
      { $sort: { category: 1, compatible_asset_type: 1 } }
    ]);
    res.json({ data: { distribution: dist } });
  } catch (e) { next(e); }
}

async function requiredParts(req, res, next) {
  try {
    const { asset_type, type_code } = req.query;

    // Graceful no-op when type_code missing
    if (!asset_type || !type_code) {
      return res.json({ data: { skus: [], total: 0, hint: 'Provide asset_type and type_code to see required parts.' } });
    }

    // From SKUCompatibility
    const compatMatches = await SKUCompatibility.aggregate([
      { $match: { type_code } },
      { $lookup: { from: 'skus', localField: 'sku', foreignField: '_id', as: 'sku' } },
      { $unwind: '$sku' },
      { $replaceRoot: { newRoot: '$sku' } }
    ]);

    // From SKUs direct list
    const skuListMatches = await SKU.find({
      compatible_asset_type: asset_type,
      compatible_type_codes: type_code
    });

    const map = new Map();
    [...compatMatches, ...skuListMatches].forEach(s => map.set(String(s._id), s));
    const skus = Array.from(map.values());

    res.json({ data: { skus, total: skus.length } });
  } catch (e) { next(e); }
}

async function compatibilityGaps(req, res, next) {
  try {
    const assets = await Asset.find({}, { _id: 1, type_code: 1 });
    const typeCodes = Array.from(new Set(assets.map(a => a.type_code)));
    const [compatTCs, skuDirectTCs] = await Promise.all([
      SKUCompatibility.distinct('type_code', { type_code: { $in: typeCodes } }),
      SKU.aggregate([
        { $unwind: { path: '$compatible_type_codes', preserveNullAndEmptyArrays: false } },
        { $match: { compatible_type_codes: { $in: typeCodes } } },
        { $group: { _id: null, codes: { $addToSet: '$compatible_type_codes' } } }
      ]).then(a => (a[0]?.codes || []))
    ]);
    const covered = new Set([...compatTCs, ...skuDirectTCs]);
    const uncovered = typeCodes.filter(c => !covered.has(c));
    res.json({ data: { uncovered_type_codes: uncovered, total_uncovered: uncovered.length } });
  } catch (e) { next(e); }
}

module.exports = {
  overview,
  towerBreakdown,
  substationBreakdown,
  skuBreakdown,
  requiredParts,
  compatibilityGaps
};