const sdg1Service = require("./sdg1Service");
const sdg2Service = require("./sdg2Service");
const sdg3Service = require("./sdg3Service");
const sdg4Service = require("./sdg4Service");
const sdg5Service = require("./sdg5Service");
const sdg6Service = require("./sdg6Service");
const sdg7Service = require("./sdg7Service");
const sdg8Service = require("./sdg8Service");
const sdg9Service = require("./sdg9Service");
const sdg10Service = require("./sdg10Service");
const sdg11Service = require("./sdg11Service");
const sdg12Service = require("./sdg12Service");
const sdg13Service = require("./sdg13Service");
const sdg14Service = require("./sdg14Service");
const sdg15Service = require("./sdg15Service");
const sdg16Service = require("./sdg16Service");
const sdg17Service = require("./sdg17Service");

const services = [
  sdg1Service,
  sdg2Service,
  sdg3Service,
  sdg4Service,
  sdg5Service,
  sdg6Service,
  sdg7Service,
  sdg8Service,
  sdg9Service,
  sdg10Service,
  sdg11Service,
  sdg12Service,
  sdg13Service,
  sdg14Service,
  sdg15Service,
  sdg16Service,
  sdg17Service
];

const serviceMap = new Map(services.map((service) => [service.id, service]));

function getAllSummaries() {
  return services.map((service) => service.getSummary());
}

function getById(id) {
  return serviceMap.get(Number(id));
}

module.exports = {
  services,
  getAllSummaries,
  getById
};
