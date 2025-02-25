import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  headerText: {
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 20,
  },
  textInput: {
    height: 150,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  footer: {
    marginTop: 'auto',
    alignItems: 'center',
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 5,
  },
  versionText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
  },
  button: {
    backgroundColor: '#5caece',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  blueText: {
    color: 'blue',
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 50,
  },
  image: {
    width: 150,
    height: 100,
    borderRadius: 10,
    borderColor: '#5caece',
    borderWidth: 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalImage: {
    width: 150,
    height: 150,
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
    color: '#fff',
  },
  modalCloseButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#5caece',
    borderRadius: 5,
  },
  modalCloseButtonText: {
    fontSize: 16,
    color: '#fff',
  },
});
