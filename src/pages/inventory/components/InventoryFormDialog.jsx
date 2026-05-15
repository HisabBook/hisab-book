import React from 'react';
import { Dialog } from '@mui/material';

import AddPhoneForm from './AddPhoneForm';
import AddLaptopForm from './AddLaptopForm';
import AddAccessoryForm from './AddAccessoryForm';

// A map to easily look up the correct form component
const formComponents = {
  phones: AddPhoneForm,
  laptops: AddLaptopForm,
  accessories: AddAccessoryForm,
};

const InventoryFormDialog = ({
  open,
  onClose,
  itemType,
  itemData,
  onSubmit,
  existingPhones,
  existingLaptops,
}) => {
  const CurrentFormComponent =
    formComponents[itemType] || (() => <div>Unknown Type</div>);

  if (!formComponents[itemType]) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='md'>
      <CurrentFormComponent
        // Determine mode based on whether itemData is provided
        mode={itemData ? 'edit' : 'create'}
        initialValues={itemData}
        onSubmit={onSubmit}
        onCancel={onClose}
        // Pass validation data down to the relevant forms
        existingPhones={existingPhones}
        existingLaptops={existingLaptops}
      />
    </Dialog>
  );
};

export default InventoryFormDialog;
