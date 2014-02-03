/**
 * Конструктор класса обмена сообщениями
 * @constructor
 */
function PubSub(){
    this.eventManager = {};
}

/**
 * Функция подписки на событие
 * @param  {string} eventName имя события
 * @param  {function} handler функция которая будет вызвана при возникновении события
 * @return {function}         ссылка на handler
 */
PubSub.prototype.subscribe = function(eventName, handler) {
    var handlers;
    if (eventName == undefined || !(handler instanceof Function)) {
        return handler;
    }
    handlers = this.eventManager[eventName];
    if (handlers && handlers.indexOf(handler) > -1) {
        return handler;
    }
    if (!handlers) {
        handlers = this.eventManager[eventName] = [];
    }
    handlers.push(handler);
    return handler;
};

/**
 * Функция отписки от события
 * @param  {string} eventName имя события
 * @param  {function} handler функция которая будет отписана
 * @return {function}         ссылка на handler
 */
PubSub.prototype.unsubscribe = function(eventName, handler) {
    var handlers = this.eventManager[eventName],
        index;
    if (!handlers || !(handler instanceof Function)) {
        return handler;
    }
    index = handlers.indexOf(handler);
    if (index > -1) {
        handlers.splice(index, 1);
    }
    return handler;
};

/**
 * Функция генерирующая событие
 * @param  {string} eventName имя события
 * @param  {object} data      данные для обработки соответствующими функциями
 * @return {bool}             удачен ли результат операции
 */
PubSub.prototype.publish = function(eventName, data) {
    if (this.eventManager[eventName]) {
        this.eventManager[eventName].forEach(function (fn) {
            setTimeout(function () {
                fn(data);
            }, 10);
        });
        return true;
    }
    return false

};

/**
 * Функция отписывающая все функции от определённого события
 * @param  {string} eventName имя события
 * @return {bool}             удачен ли результат операции
 */
PubSub.prototype.off = function(eventName) {
    if (this.eventManager[eventName]) {
        this.eventManager[eventName] = undefined;
        return true;
    }
    return false;
};

/**
 * @example
 *
 * PubSub.subscribe('click', function(event, data) { console.log(data) });
 * var second = PubSub.subscribe('click', function(event, data) { console.log(data) });
 *
 * //Отписать одну функцию от события 'click':
 * PubSub.unsubscribe('click', second);
 *
 * //Отписать группу функций от события 'click'
 * PubSub.off('click');
 */

/*
 Дополнительный вариант — без явного использования глобального объекта
 нужно заставить работать методы верно у любой функции


function foo(event, data) {
    //body…
}

foo.subscribe('click');

foo.unsubscribe('click');
 */

Function.prototype.pubSub = new PubSub();

Function.prototype.subscribe = function(eventName) {
    return this.pubSub.subscribe(eventName, this);
};

Function.prototype.unsubscribe = function(eventName) {
    return this.pubSub.unsubscribe(eventName, this);
};

