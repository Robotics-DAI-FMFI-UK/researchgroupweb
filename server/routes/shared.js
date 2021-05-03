export function fillUpdate(req, res, model) {
  res[model].schema.eachPath((path) => {
    const newVal = req.body[path];
    if (path !== "_id" && path !== "__v" && newVal !== undefined)
      res[model][path] = newVal;
  });
  return res[model];
}

export function fillCreate(req, Model) {
  const model = new Model({});
  Model.schema.eachPath((path) => {
    if (req.body[path]) {
      model[path] = req.body[path];
    }
  });
  return model;
}

export async function getModelById(req, res, Model) {
  let model;
  try {
    model = await Model.findById(req.params.id);
    if (model === null) {
      return res.status(404).json({ message: `Cannot find the ${Model}` });
    }
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
  console.log(model);
  return model;
}
