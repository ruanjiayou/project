const debug = require('debug')('APP:task_');
const config = require('../config/').queue;
const kue = require('kue');
const redis = require('redis');

const queue = kue.createQueue({
    prefix: config.redis.prefix,
    redis: {
        createClientFactory: function(){
            return redis.createClient({
                host: config.redis.host,
                port: config.redis.port
            });
        }
    }
});
queue.setMaxListeners(1000);

function create(type, data, priority, attempts, delay) {
    debug('ENTER create method!');
    attempts = attempts || 1;
    priority = priority || 'normal';

    return new Promise(function(resolve, reject){
        const task = queue
            .create(type, data)
            .delay(delay ? delay : 0)
            .priority(priority)
            .attempts(attempts)
            .save(function(err){
                if(err) {
                    return reject(err);
                } else {
                    return resolve(task.id);
                }
            });
    });
}

function cancel(id) {
    debug('ENTER cancel method!');

    return new Promise(function(resolve, reject){
        kue.Job.get(id, function(err, task){
            if(err) {
                return reject(err);
            }
            task.remove(function(error){
                if(error) {
                    return reject(error);
                } else {
                    return resolve(`removed task ${task.id}`);
                }
            });
        });
        
    });
}

module.exports = {
    create,
    cancel
};