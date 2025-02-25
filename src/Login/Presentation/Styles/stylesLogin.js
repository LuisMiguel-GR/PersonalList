import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
   backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 100,
  },
  logo: {
    width: 600,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 50,
  },
  button: {
    backgroundColor: '#9a35c2',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: 300,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  link: {
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 10,
  },
  passwordInput: {
    marginLeft: 10,
    flex: 1,
    height: 40,
  },
  eyeIconContainer: {
    paddingHorizontal: 10,
  },
  resetPasswordLink: {
    marginTop: 10,
  },
  biometricButton: {
    top: 100,
    bottom: 20,
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 50,
    elevation: 5, // para sombra en Android
    shadowColor: '#000', // para sombra en iOS
    shadowOffset: { width: 0, height: 2 }, // para sombra en iOS
    shadowOpacity: 0.8, // para sombra en iOS
    shadowRadius: 2, // para sombra en iOS
  },
});

export default styles;