import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, ScrollView } from 'react-native';
import { CheckBox, Button } from 'react-native-elements';
import { Swipeable } from 'react-native-gesture-handler';
import styles from '../Presentation/Styles/stylesListBIll';
import BillsScreenLogic from '../Domain/Hooks/BillsScreenLogic';
import EditBillModal from '../Infrastructure/EditBillModal';

const Bill = ({ bill, onPaidChange, onBillDeleted, onBillUpdated }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [newBillName, setNewBillName] = useState(bill.data.name);
  const [newBillDescription, setNewBillDescription] = useState(bill.data.description);
  const [newBillAmount, setNewBillAmount] = useState(bill.data.amount);
  const [newBillPeriodicity, setNewBillPeriodicity] = useState(bill.data.periodicity);
  const [isChecked, setIsChecked] = useState(bill.data.paid);

  const { handleUpdateBill, handleDeleteBill, handleUpdatePaidStatus } = BillsScreenLogic();

  useEffect(() => {
    setIsChecked(bill.data.paid);
  }, [bill.data.paid]);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleLongPress = () => {
    setModalVisible(true);
  };

  const handleDelete = async () => {
    const milliseconds = (bill.data.createdAt.seconds * 1000) + (bill.data.createdAt.nanoseconds / 1000000);
    let month = new Date(milliseconds);
    await handleDeleteBill(bill);

    const monthNames = [
      "january", "february", "march", "april", "may", "june",
      "july", "august", "september", "october", "november", "december"
    ];
    const monthBillCreatedAt = monthNames[month.getMonth()];
    onBillDeleted(monthBillCreatedAt);
  };

  const handleUpdate = async () => {
    await handleUpdateBill(bill, {
      name: newBillName,
      description: newBillDescription,
      amount: newBillAmount,
      periodicity: newBillPeriodicity,
      paid: isChecked,
      createdAt: bill.data.createdAt
    });
    setModalVisible(false);
    const milliseconds = (bill.data.createdAt.seconds * 1000) + (bill.data.createdAt.nanoseconds / 1000000);
    let month = new Date(milliseconds);

    const monthNames = [
      "january", "february", "march", "april", "may", "june",
      "july", "august", "september", "october", "november", "december"
    ];
    const monthBillCreatedAt = monthNames[month.getMonth()];
    onBillUpdated(monthBillCreatedAt);
  };

  const toggleCheckBox = async () => {
    const milliseconds = (bill.data.createdAt.seconds * 1000) + (bill.data.createdAt.nanoseconds / 1000000);
    let dateCreatedAt = new Date(milliseconds);
    const yearBillCreatedAt = dateCreatedAt.getFullYear();
    const monthNames = [
      "january", "february", "march", "april", "may", "june",
      "july", "august", "september", "october", "november", "december"
    ];
    const monthBillCreatedAt = monthNames[dateCreatedAt.getMonth()];
  
    await handleUpdatePaidStatus(bill.id, !isChecked, yearBillCreatedAt.toString(), monthBillCreatedAt);
  
    setIsChecked(!isChecked);
    onPaidChange(monthBillCreatedAt);
  };

  const renderRightActions = () => (
    <View style={styles.rightActions}>
      <Button
        title="Eliminar"
        onPress={handleDelete}
        buttonStyle={{ backgroundColor: 'red' }}
      />
    </View>
  );

  return (
    <Swipeable renderRightActions={renderRightActions} overshootRight={false}>
      <TouchableOpacity onLongPress={handleLongPress}>
        <View style={styles.containerBill}>
          <CheckBox
            checked={isChecked}
            onPress={toggleCheckBox}
            containerStyle={styles.checkboxContainer}
            checkedIcon="check-circle"
            uncheckedIcon="circle-o"
            checkedColor="#2ecc71"
            uncheckedColor="rgba(255, 255, 255, 0.45)"
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.textBill}>{bill.data.name}</Text>
            <Text style={styles.descriptionText}>{bill.data.description}</Text>
          </View>
          <Text style={styles.amountText}>{bill.data.amount} €</Text>
        </View>
      </TouchableOpacity>
      <EditBillModal
        isVisible={modalVisible}
        toggleModal={toggleModal}
        handleUpdate={handleUpdate}
        name={newBillName}
        setName={setNewBillName}
        description={newBillDescription}
        setDescription={setNewBillDescription}
        amount={newBillAmount}
        setAmount={setNewBillAmount}
        periodicity={newBillPeriodicity}
        setPeriodicity={setNewBillPeriodicity}
      />
    </Swipeable>
  );
};

export default Bill;
