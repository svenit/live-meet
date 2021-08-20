export default {
  uuid() {
    var temp_url = URL.createObjectURL(new Blob());
    var uuid = temp_url.toString();
    URL.revokeObjectURL(temp_url);
    return uuid.substr(uuid.lastIndexOf('/') + 1);
  },
  showFormErrors(form, errors) {
    if (errors) {
      let errorsMap = {};
      Object.keys(errors).forEach((e) => {
        if (!errorsMap[e]) errorsMap[e] = {};
        errorsMap[e].errors = errors[e].map((_) => new Error(_));
      });
      form.setFields(errorsMap);
    }
  },
};
