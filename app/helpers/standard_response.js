exports.ok = (res, values) => {
  res.status(200).send({
    'status': 200,
    'message': 'Success',
    'data': values
  }).end();
}

exports.created = (res, values) => {
  res.status(201).send({
    'status': 200,
    'message': 'Success',
    'data': values
  }).end();
}

exports.forbidden = (res) => {
  res.status(403).send({
    'status': 403,
    'message': 'Forbidden',
  }).end();
}

exports.not_found = (res) => {
  res.status(404).send({
    'status': 404,
    'message': 'Not Found'
  }).end();
}

exports.no_content = (res) => {
  res.status(204).send({
    'status': 204,
    'message': 'No Content'
  }).end();
}

exports.bad_request = (res, values) => {
  res.status(400).send({
    'status': 400,
    'message': 'Bad Request',
    'data': values
  }).end();
}

exports.internal_error = (res,values) => {
  res.status(500).send({
    'status': 500,
    'message': 'Internal server error',
    'values': values
  }).end();
}

exports.unauthorized = (res) => {
  res.status(401).send({
    'status': 401,
    'message': 'Unauthorized'
  }).end();
}
