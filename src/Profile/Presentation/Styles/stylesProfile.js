import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 10,
  },
  input: {
    marginBottom: 10,
    width: '100%',
    minWidth: 200,
  },
  saveButton: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#5caece',
  },
  logoutButtonContainer: {
    justifyContent: 'flex-end',
    padding: 20,
  },
  logoutButton: {
    marginTop: 20,
    marginBottom: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 0,
    margin: 0,
    borderRadius: 10,
    marginBottom: 0,
    paddingBottom: 0
  },
  listItem: {
    minWidth: 200,
    width: '100%',
  },
  text: {
    color: '#5caece',
  },
  editModalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    paddingBottom: 5,
    marginBottom: 0
  },
  editModalLabel: {
    fontSize: 20,
    marginBottom: 10,
  },
  editModalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 0,
  },
  editIconContainer: {
    marginRight: -10,
  },
  modalButtonCancel: {
    flex: 1,
    marginRight: 10,
    color: '#5caece'
  },
  modalButtonSave: {
    flex: 1,
    marginRight: 10,
    backgroundColor: '#5caece'
  },
  
});
