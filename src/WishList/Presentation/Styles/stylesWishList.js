import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  section: {
    backgroundColor: 'rgba(220, 220, 220, 0.5)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(150, 150, 150, 0.8)',
    padding: 15,
    marginBottom: 20,
    height: 500
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionTitleAmount:{
    backgroundColor: '#f0f0f0',
    fontSize: 14,
    borderRadius: 8,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#5caece',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  addButtonText: {
    fontSize: 30,
    color: 'white',
  },
  noWishesText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#666',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  sectionTitleCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    
  },
  sectionTitleLeft: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignItems: 'center',
    padding: 5,
    backgroundColor: 'rgba(152, 251, 152, 0.5)',
    borderRadius: 8,
    marginBottom: 16,
  },
  sectionTitleAmount: {
    fontSize: 12,
    color: 'black',
    marginLeft: 5,
    marginRight: 5
  },
});
