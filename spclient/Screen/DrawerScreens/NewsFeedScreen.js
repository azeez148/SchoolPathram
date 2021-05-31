// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React, {useState, createRef, useEffect} from 'react';
import Loader from '../Components/Loader';

import AsyncStorage from '@react-native-community/async-storage';

import {StyleSheet,
  
  Alert,
  FlatList,
  Button,
  TextInput,
  View,
  Text,
  ScrollView,
  Image,
  Keyboard,
  TouchableOpacity,
  RefreshControl,
  KeyboardAvoidingView,} from 'react-native';

const NewsFeedScreen = () => {
  const [postTitle, setPostTitle] = useState('');
  const [postDescription, setPostDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');

  const [uuid, setUUID] = useState('');
  const [token, setToken] = useState('');

  const [newsfeeds, setNewsfeeds] = useState([]);
  const [refreshing, setRefreshing] = useState(false);



  useEffect(async() => {
    const userData = await AsyncStorage.getItem('@u_info')
    let userInfo = JSON.parse(userData);
    setUUID(userInfo.uuid)
    setToken(userInfo.token)
    console.log(userInfo);      
    
    fetch("http://192.168.8.101:8001/spnewsfeed/list-newsfeed/", {
      method: 'GET',
        headers: {
          //Header Defination
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + token
        },
    })
      .then(data => {
        return data.json();
      })
      .then(data => {
        console.log(data.data);
        setNewsfeeds(data.data);
        
      })
      .catch(err => {
        console.log(123123);
      });
  }, []);


  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    
      try {
        let response = await fetch("http://192.168.8.101:8001/spnewsfeed/list-newsfeed/", {
          method: 'GET',
            headers: {
              //Header Defination
              'Content-Type': 'application/json',
              'Authorization': 'Token ' + token
            },
        });
        let responseJson = await response.json();
        console.log(responseJson);

        console.log(responseJson.data);
        setNewsfeeds(responseJson.data);
        // setListData(responseJson.result.concat(initialData));
        setRefreshing(false)
      } catch (error) {
        console.error(error);
      }
   
  }, [refreshing]);


  const postTitleRef = createRef();
  const postDescriptionRef = createRef();

  const handleSubmitPress = () => {
    setErrortext('');

    if (!postTitle) {
      alert('Please fill Post Title');
      return;
    }
    if (!postDescription) {
      alert('Please fill Post Description');
      return;
    }
    setLoading(true);
    let dataToSend = {title: postTitle, description: postDescription, created_by: uuid};
    let formBody = [];
    for (let key in dataToSend) {
      let encodedKey = encodeURIComponent(key);
      let encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');

    console.log(dataToSend)

    fetch('http://192.168.43.131:8001/spnewsfeed/create/', {
      method: 'POST',
      body: JSON.stringify(dataToSend),
      headers: {
        //Header Defination
        'Content-Type': 'application/json',
        'Authorization': 'Token '+ token
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        //Hide Loader
        setLoading(false);
        console.log(responseJson);
        // If server response message same as Data Matched
        if (responseJson.success === true) {

          console.log(responseJson.data);
        } else {
          errorMessage = 'Unexpected error, Please try again.'
          setErrortext(errorMessage);
          console.log(errorMessage);

        }
      })
      .catch((error) => {
        //Hide Loader
        setLoading(false);
        console.error(error);
      });
  };
  return (
      <View style={styles.mainBody}>
        <Loader loading={loading} />
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flex: 1,
            justifyContent: 'flex-start',
            alignContent: 'center',
          }}>
            <View>
              <KeyboardAvoidingView enabled>
                  <View style={styles.SectionStyle}>
                    <TextInput
                      style={styles.inputStyle}
                      onChangeText={(postTitle) => setPostTitle(postTitle)}
                      underlineColorAndroid="#f000"
                      placeholder="Enter a Title"
                      placeholderTextColor="#8b9cb5"
                      autoCapitalize="sentences"
                      ref={postTitleRef}
                      returnKeyType="next"
                      onSubmitEditing={() =>
                        postDescriptionRef.current && postDescriptionRef.current.focus()
                      }
                      blurOnSubmit={false}
                    />
                </View>
                <View style={styles.SectionStyle}>
                {/* <UselessTextInput
                  multiline
                  numberOfLines={4}
                  onChangeText={(postDescription) => setPostDescription(postDescription)}
                  underlineColorAndroid="#f000"
                  placeholder="Enter Details"
                  placeholderTextColor="#8b9cb5"
                  autoCapitalize="sentences"
                  ref={postDescriptionRef}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  // value={value}
                /> */}
                <TextInput
                    style={styles.inputMultiStyle}
                    placeholder="Enter Details"
                    placeholderTextColor="#8b9cb5"
                    onChangeText={(postDescription) => setPostDescription(postDescription)}
                    autoCapitalize="sentences"
                    ref={postDescriptionRef}
                    multiline={true}
                    numberOfLines={4}
                />
                </View>
                <TouchableOpacity
                  style={styles.buttonStyle}
                  activeOpacity={0.5}
                  onPress={handleSubmitPress}>
                  <Text style={styles.buttonTextStyle}>Post</Text>
                </TouchableOpacity>
              </KeyboardAvoidingView>

            </View>      

        <View style={styles.container}>
        <FlatList style={styles.list}
          data={newsfeeds}
          keyExtractor= {(item) => {
            return item.id;
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ItemSeparatorComponent={() => {
            return (
              <View style={styles.separator}/>
            )
          }}
          renderItem={(post) => {
            const item = post.item;
            return (
              <View style={styles.card}>
                <Image style={styles.cardImage} source={{uri: 'https://bootdey.com/img/Content/avatar/avatar6.png'}}/>
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.description}>{item.description}</Text>
                    <View style={styles.timeContainer}>
                      <Image style={styles.iconData} source={{uri: 'https://img.icons8.com/color/96/3498db/calendar.png'}}/>
                      <Text style={styles.time}>{item.created_by}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.cardFooter}>
                  <View style={styles.socialBarContainer}>
                    <View style={styles.socialBarSection}>
                      <TouchableOpacity style={styles.socialBarButton}>
                        <Image style={styles.icon} source={{uri: 'https://img.icons8.com/material/96/2ecc71/visible.png'}}/>
                        <Text style={styles.socialBarLabel}>78</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.socialBarSection}>
                      <TouchableOpacity style={styles.socialBarButton}>
                        <Image style={styles.icon} source={{uri: 'https://img.icons8.com/ios-glyphs/75/2ecc71/comments.png'}}/>
                        <Text style={styles.socialBarLabel}>25</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            )
          }}/>
      </View>
      </ScrollView>

      </View>
      
  );
};

export default NewsFeedScreen;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#6e93b8',
    alignContent: 'center',
  },
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    marginTop: 60,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  buttonStyle: {
    backgroundColor: '#7DE24E',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#7DE24E',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 100
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
  inputStyle: {
    flex: 1,
    color: 'white',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: '#dadae8',
  },
  inputMultiStyle: {
    flex: 1,
    color: 'white',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: '#dadae8',
    marginTop: -30,
    height: 100
  },
  registerTextStyle: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    alignSelf: 'center',
    padding: 10,
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },

  container:{
    flex:1,
    marginTop:20,
  },
  list: {
    paddingHorizontal: 17,
    backgroundColor:"#E6E6E6",
  },
  separator: {
    marginTop: 10,
  },
  /******** card **************/
  card:{
    shadowColor: '#00000021',
    shadowOffset: {
      width: 2
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    marginVertical: 8,
    backgroundColor:"white"
  },
  cardHeader: {
    paddingVertical: 17,
    paddingHorizontal: 16,
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardContent: {
    paddingVertical: 12.5,
    paddingHorizontal: 16,
  },
  cardFooter:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12.5,
    paddingBottom: 25,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 1,
    backgroundColor:"#EEEEEE",
  },
  cardImage:{
    flex: 1,
    height: 150,
    width: null,
  },
  /******** card components **************/
  title:{
    fontSize:18,
    flex:1,
  }, 
  description:{
    fontSize:15,
    color:"#888",
    flex:1,
    marginTop:5,
    marginBottom:5,
  },
  time:{
    fontSize:13,
    color: "#808080",
    marginTop: 5
  },
  icon: {
    width:25,
    height:25,
  },
  iconData:{
    width:15,
    height:15,
    marginTop:5,
    marginRight:5
  },
  timeContainer:{
    flexDirection:'row'
  },
  /******** social bar ******************/
  socialBarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1
  },
  socialBarSection: {
    justifyContent: 'center',
    flexDirection: 'row',
    flex: 1,
  },
  socialBarlabel: {
    marginLeft: 8,
    alignSelf: 'flex-end',
    justifyContent: 'center',
  },
  socialBarButton:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

