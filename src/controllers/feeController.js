const { getModelledArrayOfFees, responseCode, errorResponse } = require('../utilities/helpers');
const { clearHash } = require('../services/cache')

class FeeController {
  constructor(mainRepo) {
    this.mainRepo = mainRepo;
  }

   /**
   * save fee configurations
   * 
   * @static
   * @param {*} req
   * @param {*} res
   * @return {*}
   */
    saveFees = async (req, res) => {
      try {
        await clearHash('default');
        const { FeeConfigurationSpec } = req.body;
        const modelledFees = await getModelledArrayOfFees(FeeConfigurationSpec);
        await this.mainRepo.deleteAllModels();
        const saved = await this.mainRepo.createMany(modelledFees);
        if(saved) return res.status(200).json({ "status": "ok" });
      } catch (err) {
        console.log(err);
        return errorResponse(res, responseCode.INTERNAL_SERVER_ERROR, 'An error occurred.', err);
      }
    }
  
}
module.exports = FeeController;