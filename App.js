import React, { Component } from 'react';
import {
  View,
  Alert,
  WebView
} from 'react-native';
import Helpers from './Helpers';
import Handlebars from './libraries/handlebars-v4.0.6';

const injectScript = Helpers.getInjectedScript();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      template: `
      <style>
        .user {
          font-style: italic;
        }
      </style>
        {{#users}}
          <div class="user">
          {{inc @index}} -
          <a href="javascript:alertMessage('Click Alert|The clicked name: {{this}}')">
            {{this}}
          </a>
          </div>
        {{/users}}
        <div class="clickedMessage"><p>Nothing currently clicked.</p></div>
      `,
      data: { users: ['Jim Matthers', 'Ted Olsen', 'Greg Smith'] }
    };
  }

  onBridgeMessage(e) {
    let message = e.nativeEvent.data;
    const { webviewbridge } = this.refs;
    const bridge = Helpers.onBridgeHandler(message);
    switch (bridge.type) {
      case 'alertMessage':
        Alert.alert(
          bridge.title,
          bridge.body,
          [{ 
            text: 'Ok', 
            onPress:() => {
                webviewbridge.postMessage('clicked|<p>CLICKED: '+bridge.body+'</p>', '*');
            } 
          }]
        );
        break;
      default:
        break;
    }
  }

  render() {
    Handlebars.registerHelper('if_eq', (a, b, opts) => {
      if (a == b) {
        return opts.fn(this);
      }
      return opts.inverse(this);
    });
    Handlebars.registerHelper('inc', (value, options) => {
      return parseInt(value, 10) + 1;
    });

    const htmldata = Handlebars.compile(this.state.template);
    const htmlpage = htmldata(this.state.data);
    return (
      <View style={{ flex: 1, marginTop: 20 }}>
        <WebView
            ref="webviewbridge"
            style={{ flex: 1 }}
            onMessage={this.onBridgeMessage.bind(this)}
            source={{ html: htmlpage }}
            javaScriptEnabled
            injectedJavaScript={injectScript}
            scrollEnabled
            domStorageEnabled
        />
      </View>
    );
  }
}

export default App;
