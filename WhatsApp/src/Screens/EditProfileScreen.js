import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Modal,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {RFValue} from 'react-native-responsive-fontsize';
import CommonTextInput from '../components/TextInput';
import {Avatar} from 'react-native-paper';
import AvatarIcon from '../assets/svg/avatar.svg';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  responsiveScreenWidth,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import uuid from 'react-native-uuid';
import firestore from '@react-native-firebase/firestore';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
const EditProfileScreen = ({navigation, route}) => {
  const number = route?.params?.phoneNumber;
  const [imageResult, setImageResult] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [nameCount, setNameCount] = useState(25);
  const [about, setAbout] = useState('');
  useEffect(() => {
    if ((name && number && about) || imageResult?.assets[0]?.uri) {
      setDataOnCloud();
    }
  }, []);
  function setDataOnCloud() {
    // const userID = uuid.v4();
    firestore()
      .collection('Users')
      .doc(route?.params?.phoneNumber)
      .set({
        phoneNumber: route?.params?.phoneNumber
          ? route?.params?.phoneNumber
          : '',
        name: name ? name : '',
        image: imageResult?.assets[0]?.uri ? imageResult?.assets[0]?.uri : '',
        about: about ? about : '',
        userId: route?.params?.phoneNumber,
      })
      .then(response => {
        console.log('cloudResponse', response);
      })
      .catch(Exception => {
        console.log('error', Exception);
      });
  }
  async function OpenCamera() {
    launchCamera();
    const result = await launchCamera();
    setImageResult(result);
    console.log('camera ', result);
    setModalVisible(false);
  }
  async function OpenGallery() {
    launchImageLibrary();
    const result = await launchImageLibrary();
    setImageResult(result);
    console.log('gallery ', result);
    setModalVisible(false);
  }
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.headerText}>Edit Profile</Text>
        <View style={styles.ProfileData}>
          <View style={styles.row}>
            <TouchableWithoutFeedback onPress={() => setModalVisible(true)}>
              {!imageResult ? (
                <View style={styles.ImagePickerEmpty}>
                  <Text style={styles.ImagePickerEdit}>add Photo</Text>
                </View>
              ) : (
                <View style={styles.ImagePicker}>
                  <Avatar.Image
                    size={RFValue(50)}
                    source={{uri: imageResult?.assets[0]?.uri}}
                  />
                  <Text style={styles.ImagePickerEdit2}>Edit</Text>
                </View>
              )}
            </TouchableWithoutFeedback>
            <Text style={styles.MessageText}>
              {'Enter the name and add an optional profile picture'}
            </Text>
          </View>
          <View style={styles.column}>
            <View style={styles.dash}></View>
            <View style={styles.TextInputView}>
              <TextInput
                style={styles.input}
                maxLength={25}
                onChangeText={text => {
                  setName(text);
                  setNameCount(25 - text.length);
                }}
                value={name}
                placeholder="Name"
              />
              <Text>{nameCount}</Text>
            </View>
            <View style={styles.dash}></View>
          </View>
        </View>
        <Text style={styles.phoneNumber}>PHONE NUMBER</Text>
        <View style={styles.ProfileData}>
          <Text style={styles.Number}>{number}</Text>
        </View>
        <Text style={styles.phoneNumber}>ABOUT</Text>
        <TouchableOpacity style={styles.ProfileData}>
          <View style={styles.aboutRow}>
            <Text style={styles.aboutText}>{'#WMk'}</Text>
            <MaterialIcons
              style={styles.archiveIcon}
              name="keyboard-arrow-right"
              color={'black'}
              size={RFValue(25)}
            />
          </View>
        </TouchableOpacity>
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <View style={styles.modal}>
          <View style={styles.ImagePickerModal}>
            <View style={styles.ModalHeader}>
              <Text style={styles.ModalHeaderText}>Edit Profile Picture</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialIcons
                  style={styles.Icon}
                  name={'cancel'}
                  color={'white'}
                  size={RFValue(30)}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.modalContainer}>
              <TouchableOpacity style={styles.rowBtn} onPress={OpenCamera}>
                <View style={styles.ModalRow}>
                  <Text style={styles.RowText}>Take Photo</Text>
                  <Feather
                    style={styles.Icon}
                    name={'camera'}
                    color={'white'}
                    size={RFValue(25)}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rowBtn} onPress={OpenGallery}>
                <View style={styles.ModalRow}>
                  <Text style={styles.RowText}>Choose Photo</Text>
                  <EvilIcons
                    style={styles.Icon}
                    name={'image'}
                    color={'white'}
                    size={RFValue(30)}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.rowBtn}
                onPress={() => {
                  setImageResult();
                  setModalVisible(false);
                }}>
                <View style={styles.ModalRow}>
                  <Text style={styles.RowTextDelete}>Delete Photo</Text>
                  <AntDesign
                    style={styles.Icon}
                    name={'delete'}
                    color={'red'}
                    size={RFValue(25)}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default React.memo(EditProfileScreen);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: '3%',
    backgroundColor: 'white',
  },
  aboutRow: {
    flexDirection: 'row',
  },
  Number: {
    color: 'black',
    fontSize: RFValue(13),
    fontWeight: '700',
    marginStart: '2%',
    textAlign: 'left',
    alignSelf: 'flex-start',
    paddingVertical: '2%',
  },
  aboutText: {
    color: 'black',
    fontSize: RFValue(13),
    fontWeight: '700',
    marginStart: '2%',
    textAlign: 'left',
    alignSelf: 'flex-start',
    paddingVertical: '2%',
    flex: 1,
  },
  column: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  phoneNumber: {
    color: 'black',
    fontSize: RFValue(13),
    fontWeight: '700',
    marginStart: '5%',
    marginTop: '5%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '5%',
  },

  headerText: {
    textAlign: 'center',
    fontSize: RFValue(15),
    marginVertical: '2%',
  },
  input: {
    width: responsiveScreenWidth(80),
    height: responsiveScreenHeight(4),
    alignItems: 'center',
  },
  ProfileData: {
    // flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'lightgrey',
    borderRadius: RFValue(8),
    padding: '3%',
    marginVertical: '2%',
  },
  dash: {
    borderWidth: RFValue(1),
    borderStyle: 'solid',
    borderColor: 'white',
    width: responsiveScreenWidth(90),
    marginVertical: '2%',
    marginStart: '5%',
  },
  ImagePicker: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  ImagePickerEmpty: {
    justifyContent: 'center',
    alignItems: 'center',
    height: responsiveScreenHeight(8),
    aspectRatio: 1,
    borderRadius: RFValue(100),
    borderColor: 'white',
    borderWidth: RFValue(1),
    marginStart:'5%'
  },
  ImagePickerEdit: {
    // bottom: RFValue(18),
    fontSize: RFValue(12),
    fontWeight: '600',
    color: 'blue',
    textAlign: 'center',
    padding:'5%'
  },
  ImagePickerEdit2: {
    top: RFValue(8),
    fontSize: RFValue(13),
    fontWeight: '700',
    color: 'blue',
  },
  TextInputView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  MessageText: {
    marginHorizontal: '4%',
    flexWrap: 'wrap',
    width: '75%',
    textAlignVertical: 'top',
  },
  ImagePickerModal: {
    backgroundColor: 'grey',
    borderTopRightRadius: RFValue(13),
    borderTopLeftRadius: RFValue(13),
    flex: 0.34,
    padding: '3%',
  },
  modal: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  ModalHeader: {
    flex: 0.3,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '8%',
  },
  ModalHeaderText: {
    fontSize: RFValue(15),
    color: 'white',
    textAlign: 'center',
    flex: 1,
  },
  ModalRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBtn: {
    borderBottomWidth: RFValue(1),
    paddingVertical: '3%',
    borderColor: 'white',
  },
  RowText: {
    flex: 1,
    fontSize: RFValue(15),
    color: 'white',
  },
  RowTextDelete: {
    flex: 1,
    fontSize: RFValue(15),
    color: 'red',
  },
  modalContainer: {
    flex: 0.9,
    backgroundColor: 'black',
    borderRadius: RFValue(13),
    padding: '3%',
    bottom: '10%',
  },
});
