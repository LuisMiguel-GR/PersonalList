import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10, 
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    backgroundColor: 'purple',
  },
  info: {
    marginLeft: 10,
    flex: 1,
  },
  title: {
    fontSize: 18,
  },
  description: {
    marginBottom: 5,
    fontSize: 12,
    color: '#5caece',
  },
  amount: {
    marginBottom: 5,
    textAlign: 'right',
  },
  editButton: {
    color: 'blue',
    marginRight: 10,
  },
  deleteButton: {
    color: 'red',
  },
  rightActions: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  deleteButtonStyle: {
    backgroundColor: 'red',
  },
  deleteButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    height: '100%',
  },
});
