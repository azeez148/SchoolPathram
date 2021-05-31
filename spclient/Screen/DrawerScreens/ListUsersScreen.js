// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Image, Alert, ScrollView, FlatList, RefreshControl} from 'react-native';

const ListUsersScreen = () => {

const [token, setToken] = useState('');
const [users, setUsers] = useState([]);
const [refreshing, setRefreshing] = useState(false);


// const [lastName, setLastName] = useState('');
// const [email, setEmail] = useState('');

//  useEffect(async()=>{
//     const userData = await AsyncStorage.getItem('@u_info')
//     let userInfo = JSON.parse(userData);               
//     setToken(userInfo.token)
//     fetchUsers()
//   },[])

useEffect(async() => {
  const userData = await AsyncStorage.getItem('@u_info')
    let userInfo = JSON.parse(userData);
    setToken(userInfo.token)
    console.log(userInfo);

  fetch("http://192.168.8.101:8001/spaccount/list-users/", {
    method: 'GET',
      headers: {
        //Header Defination
        'Content-Type': 'application/json',
        'Authorization': 'Token' + token
      },
  })
    .then(data => {
      return data.json();
    })
    .then(data => {
      console.log(data.data);
      setUsers(data.data);
    })
    .catch(err => {
      console.log(123123);
    });
}, []);



const onRefresh = React.useCallback(async () => {
  setRefreshing(true);
  
    try {
      let response = await fetch("http://192.168.43.131:8001/spaccount/list-users/", {
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
      setUsers(responseJson.data);
      // setListData(responseJson.result.concat(initialData));
      setRefreshing(false)
    } catch (error) {
      console.error(error);
    }
 
}, [refreshing]);


  return (
      <View style={styles.container}>
        <FlatList style={styles.list}
          contentContainerStyle={styles.listContainer}
          data={users}
          horizontal={false}
          numColumns={2}
          keyExtractor= {(item) => {
            return item.username;
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({item}) => {
            return (
              <TouchableOpacity style={styles.card} onPress={() => {this.clickEventListener(item)}}>
                <View style={styles.cardHeader}>
                  <Image style={styles.icon} source={{uri:"https://img.icons8.com/flat_round/64/000000/hearts.png"}}/>
                </View>
                <Image style={styles.userImage} source={{uri:"https://bootdey.com/img/Content/avatar/avatar6.png"}}/>
                <View style={styles.cardFooter}>
                  <View style={{alignItems:"center", justifyContent:"center"}}>
                    <Text style={styles.name}>{item.first_name} {item.last_name}</Text>
                    <Text style={styles.position}>{item.email}</Text>
                    <TouchableOpacity style={styles.followButton} onPress={()=> this.clickEventListener(item)}>
                      <Text style={styles.followButtonText}>Follow</Text>  
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            )
          }}/>
      </View>
  );
};

export default ListUsersScreen;

const styles = StyleSheet.create({
  container:{
    flex:1,
    marginTop:20,
  },
  list: {
    paddingHorizontal: 5,
    backgroundColor:"#E6E6E6",
  },
  listContainer:{
   alignItems:'center'
  },
  /******** card **************/
  card:{
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,

    marginVertical: 5,
    backgroundColor:"white",
    flexBasis: '46%',
    marginHorizontal: 5,
  },
  cardFooter: {
    paddingVertical: 17,
    paddingHorizontal: 16,
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1,
    flexDirection: 'row',
    alignItems:"center", 
    justifyContent:"center"
  },
  cardContent: {
    paddingVertical: 12.5,
    paddingHorizontal: 16,
  },
  cardHeader:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12.5,
    paddingBottom: 25,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 1,
  },
  userImage:{
    height: 120,
    width: 120,
    borderRadius:60,
    alignSelf:'center',
    borderColor:"#DCDCDC",
    borderWidth:3,
  },
  name:{
    fontSize:18,
    flex:1,
    alignSelf:'center',
    color:"#008080",
    fontWeight:'bold'
  },
  position:{
    fontSize:14,
    flex:1,
    alignSelf:'center',
    color:"#696969"
  },
  followButton: {
    marginTop:10,
    height:35,
    width:100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:30,
    backgroundColor: "#00BFFF",
  },
  followButtonText:{
    color: "#FFFFFF",
    fontSize:20,
  },
  icon:{
    height: 20,
    width: 20, 
  }
});    
                     