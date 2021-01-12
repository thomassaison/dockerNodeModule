'use strict';
const { Docker } = require('node-docker-api');
const docker = new Docker();

const functions = {}

functions.listDockerContainers = async () => {
    let r = await docker.container.list()
    let arr = []
    r.forEach(e => {
        let curObj = {
            names: e.data.Names,
            id: e.id
        }
        // console.log(e.id)
        // console.log(curObj)
        arr.push(curObj)
    })
    return arr;
}

functions.retrieveContainer = async (id) => {
    let containerArray = await docker.container.list();
    let finded = containerArray.find(c => c.id == id);
    return finded;
}

functions.getContainerStatus = async (id) => {
    let retrieved = await functions.retrieveContainer(id);
    if (retrieved) return retrieved.status();
    return null;
}

functions.getContainerStats = async (id) => {
    return await (await functions.getContainerStatus(id)).stats();;
}

functions.startContainer = async (id) => {
    let container = await functions.retrieveContainer(id);
    return new Promise((resolve, reject) => {
        container.start().then(r => resolve(r)).catch(err => reject(err));
    })
}

functions.restartContainer = async (id) => {
    let container = await functions.retrieveContainer(id);
    return new Promise((resolve, reject) => {
        container.restart().then(r => resolve(r)).catch(err => reject(err));
    })
}

functions.stopContainer = async (id) => {
    let container = await functions.retrieveContainer(id);
    return new Promise((resolve, reject) => {
        container.stop().then(r => resolve(r)).catch(err => reject(err));
    })
}

functions.deleteContainer = async (id) => {
    let container = await functions.retrieveContainer(id);
    return new Promise((resolve, reject) => {
        container.delete().then(r => resolve(r)).catch(err => reject(err));
    })
}

(async () => {
    let data = await functions.listDockerContainers();
    let r = await functions.getContainerStats(data[0].id)
    console.log(r)
})()





module.exports = functions