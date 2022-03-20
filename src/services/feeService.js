class FeeService {

 getModelledArrayOfFees = async (FeeConfigurationSpec) => {
    const feeArray = FeeConfigurationSpec.split('\n');
    let splited;
    let subSplit;
    const newFeeArray = await feeArray.map(fee => {
      splited = fee.split(' ')
      subSplit = splited[3].split('(');
      return { fee_id: splited[0], fee_currency: splited[1], fee_locale: splited[2], fee_entity: subSplit[0], entity_property: subSplit[1].slice(0, -1), fee_type: splited[6], fee_value: splited[7] }
    });
    return newFeeArray;
  }
}

module.export = FeeService;
