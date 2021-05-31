// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-community/async-storage';


import {View, Text, Image, StyleSheet} from 'react-native';

const ProfileScreen = () => {

const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');
const [email, setEmail] = useState('');

 useEffect(async()=>{
    const userData = await AsyncStorage.getItem('@u_info')
    let userInfo = JSON.parse(userData);       
    console.log(userInfo);      
        
    setEmail(userInfo.email)
    setFirstName(userInfo.firstName)
    setLastName(userInfo.lastName)
  },[])


  return (
    <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
              <Image style={styles.avatar}
                source={{uri: 'https://bootdey.com/img/Content/avatar/avatar6.png'}}/>

              <Text style={styles.name}>{firstName} </Text>
              <Text style={styles.userInfo}>{email}</Text>
              {/* <Text style={styles.userInfo}>Florida </Text> */}
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.item}>
            <View style={styles.iconContent}>
            <Text style={styles.info}>First Name: </Text>
            
              {/* <Image style={styles.icon} source={{uri: 'https://img.icons8.com/color/70/000000/cottage.png'}}/> */}
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.info}>{firstName}</Text>
            </View>
          </View>

          <View style={styles.item}>
            <View style={styles.iconContent}>
            <Text style={styles.info}>Last Name: </Text>

              {/* <Image style={styles.icon} source={{uri: 'https://img.icons8.com/color/70/000000/administrator-male.png'}}/> */}
            </View>
            <View style={styles.infoContent}>
            <Text style={styles.info}>{lastName}</Text>
            </View>
          </View>

          <View style={styles.item}>
            <View style={styles.iconContent}>
            <Text style={styles.info}>Email: </Text>

              {/* <Image style={styles.icon} source={{uri: 'https://img.icons8.com/color/70/000000/filled-like.png'}}/> */}
            </View>
            <View style={styles.infoContent}>
            <Text style={styles.info}>{email}</Text>
            </View>
          </View>

          {/* <View style={styles.item}>
            <View style={styles.iconContent}>
              <Image style={styles.icon} source={{uri: 'https://img.icons8.com/color/70/000000/facebook-like.png'}}/>
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.info}>Shop</Text>
            </View>
          </View> */}

        </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  header:{
    backgroundColor: "#DCDCDC",
  },
  headerContent:{
    padding:30,
    alignItems: 'center',
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom:10,
  },
  name:{
    fontSize:22,
    color:"#000000",
    fontWeight:'600',
  },
  userInfo:{
    fontSize:16,
    color:"#778899",
    fontWeight:'600',
  },
  body:{
    backgroundColor: "#778899",
    height:500,
    alignItems:'center',
  },
  item:{
    flexDirection : 'row',
  },
  infoContent:{
    flex:1,
    alignItems:'flex-start',
    paddingLeft:5
  },
  iconContent:{
    flex:1,
    alignItems:'flex-end',
    paddingRight:5,
  },
  icon:{
    width:30,
    height:30,
    marginTop:20,
  },
  info:{
    fontSize:18,
    marginTop:20,
    color: "#FFFFFF",
  }
});