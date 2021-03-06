import 'react-native-gesture-handler';
import {
  View,
  TextInput,
  Text,
  Image,
  TouchableOpacity,
  Button,
  Alert,
} from 'react-native';
import React from 'react';
import styles from './styles';
import {firebase} from '@react-native-firebase/messaging';
//import { post } from '../../backend/src/routers/userRouter';

class SignScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // new_name: '',
      new_fn: '',
      new_ln: '',
      new_email: '',
      new_pwd: '',
      //new_pn: '',
      isFinder: '',
      isLoading: false,
    };
  }

  async createUser() {
    if (this.state.new_pwd === '' || this.state.new_pwd === '') {
      Alert.alert(
        'Sign up information incomplete, please complete the procedure',
      );
    } else {
      // create new user
      this.setState({isLoading: true});
      firebase
        .auth()
        .createUserWithEmailAndPassword(
          this.state.new_email,
          this.state.new_pwd,
        )
        .then((res) => {
          console.log('User created successfully ' + JSON.stringify(res));
          let uid = res.user.uid;
          //this.createNewUser(uid);

          const url =
            'http://ec2-34-214-245-195.us-west-2.compute.amazonaws.com:6464/user/createNewUser';

          //get the firebase UID from response and generate unique user id for each user
          let body = JSON.stringify({
            first_name: this.state.new_fn,
            last_name: this.state.new_ln,
            firebase_uid: uid,
            isFinder: this.state.isFinder,
          });

          fetch(url, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: body,
          }).then((response) => {
            if (response.status == 201 || response.status == 200) {
              console.log('user created in the database');
              //console.log()
              this.setState({
                //new_name: '',
                new_fn: '',
                new_ln: '',
                new_email: '',
                new_pwd: '',
                isFinder: '',
                isLoading: false,
              });
              this.props.navigation.navigate('LoginPage');
            }
          });
        });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholderTextColor="#003f5c"
            placeholder="First name"
            onChangeText={(fn_input) => this.setState({new_fn: fn_input})}
            value={this.state.new_fn}
          />
        </View>

        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholderTextColor="#003f5c"
            placeholder="Last name"
            onChangeText={(ln_input) => this.setState({new_ln: ln_input})}
            value={this.state.new_ln}
          />
        </View>

        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholderTextColor="#003f5c"
            placeholder="Enter email address"
            onChangeText={(email_input) =>
              this.setState({new_email: email_input})
            }
            value={this.state.new_email}
          />
        </View>

        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholderTextColor="#003f5c"
            placeholder="Enter password"
            onChangeText={(pwd_input) => this.setState({new_pwd: pwd_input})}
            value={this.state.new_pwd}
          />
        </View>

        {/* <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholderTextColor='#003f5c'
            placeholder='Enter phone number'
            onChangeText={(pn_input) => this.setState({ new_pn: pn_input })}
            value={this.state.new_pn} />
        </View> */}

        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholderTextColor="#003f5c"
            placeholder="Found a pet?"
            onChangeText={(finder_input) =>
              this.setState({isFinder: finder_input})
            }
            value={this.state.isFinder}
          />
        </View>

        <TouchableOpacity
          onPress={() => this.createUser()}
          style={styles.loginButton}>
          <Text>Sign Up</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default SignScreen;
