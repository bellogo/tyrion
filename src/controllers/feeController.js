const { getModelledArrayOfFees, responseCode, errorResponse } = require('../utilities/helpers');

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
        const { FeeConfigurationSpec } = req.body;
        const modelledFees = await getModelledArrayOfFees(FeeConfigurationSpec);
          const saved = await this.mainRepo.createMany(modelledFees);
          if(saved) return res.status(200).json({ "status": "ok" });
        } catch (err) {
        if (err.code === 11000) {// error code for duplicate FEE-ID after saving unique ones
          return res.status(200).json({ "status": "ok" });
        }
        console.log(err);
        return errorResponse(res, responseCode.INTERNAL_SERVER_ERROR, 'An error occurred.', err);
      }
    }
  
}
module.exports = FeeController;
