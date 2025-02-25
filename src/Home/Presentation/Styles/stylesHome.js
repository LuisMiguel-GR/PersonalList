import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  container: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
  card: {
    width: '100%',
    marginVertical: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  cardBackground: {
    width: '100%',
    height: 150,
    justifyContent: 'flex-end',
  },
  cardContent: {
    backgroundColor: 'transparent',
    padding: 10,
    paddingBottom: 20,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  cardActions: {
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
    padding: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  cardTitle: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 22,
    textShadowColor: 'rgba(0, 0, 0, 0.50)',
    textShadowOffset: { width: 3, height: 1 },
    textShadowRadius: 7,
  },
  cardText: {
    color: '#787171',
    fontSize: 15,
  },
  avatar: {
    marginRight: 5,
    margin: 0,
    padding: 0,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 5,
  },
});
