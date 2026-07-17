import { StyleSheet } from 'react-native';

const stylesBillsList = StyleSheet.create({
  containerBill: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 3,
    paddingRight: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  checkboxContainer: {
    margin: 0,
    padding:2
  },
  textBill: {
    color: '#ffffff',
    fontSize: 17,
    fontFamily: 'Pacifico',
  },
  descriptionText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
    fontFamily: 'Pacifico',
  },
  amountText: {
    fontSize: 18,
    color: '#ffd700',
    marginLeft: 'auto',
    fontFamily: 'Pacifico',
    fontWeight: 'bold',
  },
  rightActions: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    backgroundColor: 'transparent',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 25,
  },
  label: {
    fontSize: 14,
    marginTop: 10,
  },
  input: {
    width: '100%',
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    color: '#5caece',
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#d9534f',
    width: '48%',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: '#5caece',
    width: '48%',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 25,
  },
  label: {
    fontSize: 14,
    marginTop: 10,
  },
  input: {
    width: '100%',
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    color: '#5caece',
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#d9534f',
    width: '48%',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: '#5caece',
    width: '48%',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    paddingHorizontal: 20,
  },
});

export default stylesBillsList;
