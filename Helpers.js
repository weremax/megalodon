const Helpers = {
    getInjectedScript() {
    return `
      (function() {
          if (window) {
            alertMessage = function(message) {
              window.postMessage('alertMessage:'+message, '*');
            };
            window.document.addEventListener("message", function(data) {
              let message = data;
              let mess = message.data;
              title = mess.substr(0, mess.indexOf('|'));
              body = mess.substr(mess.indexOf('|') + 1, mess.length);
              switch(title) {
                case 'clicked':
                default:
                  document.getElementsByClassName('clickedMessage')[0].innerHTML = body;
                  break;
              }
            });
          }
      }());
    `;
  },

  onBridgeHandler(message) {
    let messager = {
      type: '',
      title: '',
      body: ''
    };
    const type = message.substr(0, message.indexOf(':'));
    const info = message.substr(message.indexOf(':') + 1, message.length);
    let title = '';
    let body = '';
    switch (type) {
      case 'alertMessage':
        if (info.includes('|')) {
          title = info.substr(0, info.indexOf('|'));
          body = info.substr(info.indexOf('|') + 1, info.length);
        } else {
          title = 'ALERT';
          body = info;
        }
        messager = {
          type: 'alertMessage',
          title,
          body
        };
        break;
      default:
        break;
    }
    return messager;
  }
};

export default Helpers;
