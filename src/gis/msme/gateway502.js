export function isGateway502Error(err) {
  if (!err) return false;
  try {
    var d = err.details || {};
    if (Number(d.httpStatus) === 502 || Number(d.status) === 502) return true;
  } catch (e0) {}
  var m = String((err && err.message) || "");
  return m.indexOf("status: 502") >= 0 || m.indexOf("status 502") >= 0;
}
