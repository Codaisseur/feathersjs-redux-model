import SocketClient from 'socket.io-client';
import Feathers from 'feathers-client';
import api from '../middleware/api';

class BaseModel {
  defaults() { return {}; }

  findParams() { return {}; }

  constructor(resourceName, dispatch, onError) {
    this.app = api.app
    this.resourceName = resourceName
    this.service = this.app.service(`${resourceName}s`);
    this.onChanges = [];
    this.resources = [];

    this.dispatch = dispatch
    this.service.on('created', this.createResource.bind(this));
    this.service.on('updated', this.updateResource.bind(this));
    this.service.on('removed', this.removeResource.bind(this));
  }

  find() {
    let self = this;

    this.service.find(this.findParams(), (error, resources) => {
      if (error) {
        console.error(error);
      } else {
        this.resources = resources.data;
        this.resourcesFetched()
      }
    }).then((page) => {
      self.resources = self.resources.concat(page.data)
      self.resourcesFetched()
    }).catch((error) => (console.log(error)));
  }

  create(properties = {}) {
    this.service.create(Object.assign({}, this.defaults(), properties));
  }

  destroy(resource) {
    this.service.remove(resource._id);
  }

  save(resource, properties) {
    this.service.update(resource._id, properties);
  }

  getResource() {
    return this.service.get(arguments);
  }

  resourcesFetched() {
    this.dispatch({
      type: `${this.resourceName.toUpperCase()}S_FETCHED`,
      payload: this.resources
    })
  }

  createResource(resource) {
    this.dispatch({
      type: `${this.resourceName.toUpperCase()}_CREATED`,
      payload: resource
    })
  }

  updateResource(resource) {
    this.dispatch({
      type: `${this.resourceName.toUpperCase()}_UPDATED`,
      payload: resource
    })
  }

  removeResource(resource) {
    this.dispatch({
      type: `${this.resourceName.toUpperCase()}_REMOVED`,
      payload: resource
    })
  }
}

export default BaseModel;
