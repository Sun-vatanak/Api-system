import React, { useRef, useState, useEffect } from 'react';
import generatePDF from 'react-to-pdf';
import './App.css';

function App() {
  const targetRef = useRef();
  const [formData, setFormData] = useState({
    institutionName: 'ឈ្មោះស្ថាប័ន', // Institution name
    preparerName: '', // Name of the person preparing the invoice
    senderCode: '', // Sender code
    senderAddress: '', // Sender address
    senderPhone: '', // Sender phone
    receiverCode: '', // Receiver code  
    receiverAddress: '', // Receiver address
    receiverPhone: '', // Receiver phone
    items: [
      { id: 1, name: '', quantity: 0, unit: 'L', price: 0, total: 0, note: '' },
    ],
    total: 0, // Initialize total to 0
    notes: ['', '', '', '', '', '', '', ''], // 8 notes by default
  });
  const [errors, setErrors] = useState({});

  // Handle input changes for form fields
  const handleChange = (e, itemIndex = null, field = null) => {
    const { name, value } = e.target;
    if (itemIndex !== null && field) {
      const updatedItems = [...formData.items];
      updatedItems[itemIndex] = {
        ...updatedItems[itemIndex],
        [field]: field === 'quantity' || field === 'price' ? parseFloat(value) || 0 : value,
      };
      updatedItems[itemIndex].total = updatedItems[itemIndex].quantity * updatedItems[itemIndex].price;
      const newTotal = updatedItems.reduce((sum, item) => sum + (item.total || 0), 0);
      setFormData((prev) => ({
        ...prev,
        items: updatedItems,
        total: newTotal,
      }));
    } else if (name.startsWith('notes')) {
      const noteIndex = parseInt(name.split('-')[1], 10);
      const updatedNotes = [...formData.notes];
      updatedNotes[noteIndex] = value;
      setFormData((prev) => ({
        ...prev,
        notes: updatedNotes,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Add a new item to the items array
  const addItem = () => {
    const newItem = {
      id: formData.items.length + 1,
      name: '',
      quantity: 0,
      unit: 'L',
      price: 0,
      total: 0,
      note: '',
    };
    const updatedItems = [...formData.items, newItem];
    const newTotal = updatedItems.reduce((sum, item) => sum + (item.total || 0), 0);
    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
      total: newTotal,
    }));
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    if (!formData.preparerName.trim()) newErrors.preparerName = 'Preparer name is required';
    if (!formData.senderCode.trim()) newErrors.senderCode = 'Sender code is required';
    if (!formData.senderAddress.trim()) newErrors.senderAddress = 'Sender address is required';
    if (!formData.senderPhone.trim()) newErrors.senderPhone = 'Sender phone is required';
    if (!formData.receiverCode.trim()) newErrors.receiverCode = 'Receiver code is required';
    if (!formData.receiverAddress.trim()) newErrors.receiverAddress = 'Receiver address is required';
    if (!formData.receiverPhone.trim()) newErrors.receiverPhone = 'Receiver phone is required';
    if (formData.items.some(item => !item.name.trim() || item.quantity <= 0 || item.price <= 0)) {
      newErrors.items = 'All items must have a name, and quantity/price must be greater than 0';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission and PDF generation
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form Data before PDF:', formData); // Debug log
      // Use requestAnimationFrame to ensure DOM updates before PDF generation
      requestAnimationFrame(() => {
        generatePDF(targetRef, {
          filename: `${formData.senderCode || 'invoice'}.pdf`,
          resolution: 2,
        }).then(() => {
          alert('Invoice submitted successfully! PDF downloaded.');
        }).catch((error) => {
          console.error('PDF generation failed:', error);
          alert('Failed to generate PDF. Check console for details.');
        });
      });
    } else {
      alert('Please fix the errors before submitting.');
    }
  };

  // Ensure targetRef updates with formData changes
  useEffect(() => {
    // This ensures the ref content is ready when formData changes
    if (targetRef.current) {
      console.log('targetRef updated with:', formData); // Debug log
    }
  }, [formData]);

  return (
    <div className="App bg-white text-black font-sans">
      <div className="container mx-auto p-4">
        <div className="text-center">
          <h1 className="text-xl font-bold">បញ្ជីតម្លៃប្រចាំខែ</h1>
          <h2 className="text-lg">{formData.institutionName}</h2>
          <h3 className="text-lg">
            <input
              type="text"
              name="preparerName"
              value={formData.preparerName}
              onChange={handleChange}
              className="input-field border-b border-gray-300 text-center"
              placeholder="ឈ្មោះអ្នកធ្វើបញ្ជី"
            />
          </h3>
          {errors.preparerName && <p className="error">{errors.preparerName}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p>លេខរៀងកូដសម្គាល់សារពើភ័ណ្ឌ</p>
            <input
              type="text"
              name="senderCode"
              value={formData.senderCode}
              onChange={handleChange}
              className="input-field border-b border-gray-300 w-full"
            />
            {errors.senderCode && <p className="error">{errors.senderCode}</p>}
            <p>អាសយដ្ឋាន ផ្ទះ លេខ ផ្លូវ</p>
            <input
              type="text"
              name="senderAddress"
              value={formData.senderAddress}
              onChange={handleChange}
              className="input-field border-b border-gray-300 w-full"
            />
            {errors.senderAddress && <p className="error">{errors.senderAddress}</p>}
            <p>លេខទូរស័ព្ទទំនាក់ទំនង</p>
            <input
              type="text"
              name="senderPhone"
              value={formData.senderPhone}
              onChange={handleChange}
              className="input-field border-b border-gray-300 w-full"
            />
            {errors.senderPhone && <p className="error">{errors.senderPhone}</p>}
          </div>
          <div>
            <p>លេខកូដសារពើភ័ណ្ឌ</p>
            <input
              type="text"
              name="receiverCode"
              value={formData.receiverCode}
              onChange={handleChange}
              className="input-field border-b border-gray-300 w-full"
            />
            {errors.receiverCode && <p className="error">{errors.receiverCode}</p>}
            <p>អាសយដ្ឋាន</p>
            <input
              type="text"
              name="receiverAddress"
              value={formData.receiverAddress}
              onChange={handleChange}
              className="input-field border-b border-gray-300 w-full"
            />
            {errors.receiverAddress && <p className="error">{errors.receiverAddress}</p>}
            <p>លេខទូរស័ព្ទទំនាក់ទំនង</p>
            <input
              type="text"
              name="receiverPhone"
              value={formData.receiverPhone}
              onChange={handleChange}
              className="input-field border-b border-gray-300 w-full"
            />
            {errors.receiverPhone && <p className="error">{errors.receiverPhone}</p>}
          </div>
        </div>

        <div className="mt-8">
          <table className="w-full border-collapse border border-black">
            <thead>
              <tr>
                <th className="border border-black p-2">ល.រ</th>
                <th className="border border-black p-2">ឈ្មោះទំនិញ</th>
                <th className="border border-black p-2">ចំនួន</th>
                <th className="border border-black p-2">ឯកតា</th>
                <th className="border border-black p-2">តម្លៃរាយ</th>
                <th className="border border-black p-2">តម្លៃសរុប</th>
                <th className="border border-black p-2">ចំណាំ</th>
              </tr>
            </thead>
            <tbody>
              {formData.items.map((item) => (
                <tr key={item.id}>
                  <td className="border border-black p-2">{item.id}</td>
                  <td className="border border-black p-2">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleChange(e, item.id - 1, 'name')}
                      className="input-field w-full border-0"
                    />
                  </td>
                  <td className="border border-black p-2">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleChange(e, item.id - 1, 'quantity')}
                      className="input-field w-full border-0"
                      min="1"
                      step="1"
                    />
                  </td>
                  <td className="border border-black p-2">
                    <input
                      type="text"
                      value={item.unit}
                      onChange={(e) => handleChange(e, item.id - 1, 'unit')}
                      className="input-field w-full border-0"
                    />
                  </td>
                  <td className="border border-black p-2">
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => handleChange(e, item.id - 1, 'price')}
                      className="input-field w-full border-0"
                      min="1"
                      step="0.01"
                    />
                  </td>
                  <td className="border border-black p-2">{(item.total || 0).toLocaleString()} KHR</td>
                  <td className="border border-black p-2">
                    <input
                      type="text"
                      value={item.note}
                      onChange={(e) => handleChange(e, item.id - 1, 'note')}
                      className="input-field w-full border-0"
                      placeholder="(ប្រភេទទំនិញ)"
                    />
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan="5" className="border border-black p-2 text-right">
                  សរុប
                </td>
                <td className="border border-black p-2">{(formData.total || 0).toLocaleString()} KHR</td>
                <td className="border border-black p-2"></td>
              </tr>
            </tbody>
          </table>
          {errors.items && <p className="error mt-2">{errors.items}</p>}
          <button
            onClick={addItem}
            className="mt-4 bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            Add Item
          </button>
        </div>

        <div className="mt-8">
          <p>លេខសំុបញ្ជីបញ្ជាក់លើ</p>
          <div className="grid grid-cols-4 gap-4">
            {formData.notes.slice(0, 8).map((note, index) => (
              <p key={index}>
                No({index + 1}) {' '}
                <input
                  type="text"
                  name={`notes-${index}`}
                  value={note}
                  onChange={handleChange}
                  className="input-field border-b border-gray-300 w-full inline-block"
                />
              </p>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mt-8 text-center">
          <div>
            <p>ប្រធានស្ថាប័ន</p>
            <p>ហត្ថលេខា</p>
          </div>
          <div>
            <p>ប្រធានគណនេយ្យ</p>
            <p>ហត្ថលេខា</p>
          </div>
          <div>
            <p>អ្នកធ្វើបញ្ជី</p>
            <p>{formData.preparerName || 'ហត្ថលេខា'}</p>
          </div>
          <div>
            <p>អនុម័ត</p>
            <p>ហត្ថលេខា</p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="mt-8 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Submit & Download PDF
        </button>
      </div>

      {/* PDF content (off-screen but renderable) */}
      <div
        ref={targetRef}
        style={{
          position: 'absolute',
          left: '-9999px', // Off-screen instead of hidden
          fontFamily: '"Noto Sans Khmer", Arial, sans-serif',
          padding: '1rem',
          backgroundColor: '#fff',
          color: '#000',
          maxWidth: '800px',
          width: '800px',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>បញ្ជីតម្លៃប្រចាំខែ</h1>
          <h2 style={{ fontSize: '1rem' }}>{formData.institutionName}</h2>
          <h3 style={{ fontSize: '1rem' }}>{formData.preparerName || 'ឈ្មោះអ្នកធ្វើបញ្ជី'}</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
          <div>
            <p>លេខរៀងកូដសម្គាល់សារពើភ័ណ្ឌ: {formData.senderCode || 'N/A'}</p>
            <p>អាសយដ្ឋាន ផ្ទះ លេខ ផ្លូវ: {formData.senderAddress || 'N/A'}</p>
            <p>លេខទូរស័ព្ទទំនាក់ទំនង: {formData.senderPhone || 'N/A'}</p>
          </div>
          <div>
            <p>លេខកូដសារពើភ័ណ្ឌ: {formData.receiverCode || 'N/A'}</p>
            <p>អាសយដ្ឋាន: {formData.receiverAddress || 'N/A'}</p>
            <p>លេខទូរស័ព្ទទំនាក់ទំនង: {formData.receiverPhone || 'N/A'}</p>
          </div>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid black' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid black', padding: '0.5rem' }}>ល.រ</th>
                <th style={{ border: '1px solid black', padding: '0.5rem' }}>ឈ្មោះទំនិញ</th>
                <th style={{ border: '1px solid black', padding: '0.5rem' }}>ចំនួន</th>
                <th style={{ border: '1px solid black', padding: '0.5rem' }}>ឯកតា</th>
                <th style={{ border: '1px solid black', padding: '0.5rem' }}>តម្លៃរាយ</th>
                <th style={{ border: '1px solid black', padding: '0.5rem' }}>តម្លៃសរុប</th>
                <th style={{ border: '1px solid black', padding: '0.5rem' }}>ចំណាំ</th>
              </tr>
            </thead>
            <tbody>
              {formData.items.map((item) => (
                <tr key={item.id}>
                  <td style={{ border: '1px solid black', padding: '0.5rem' }}>{item.id}</td>
                  <td style={{ border: '1px solid black', padding: '0.5rem' }}>{item.name || 'N/A'}</td>
                  <td style={{ border: '1px solid black', padding: '0.5rem' }}>{item.quantity || 0}</td>
                  <td style={{ border: '1px solid black', padding: '0.5rem' }}>{item.unit || 'L'}</td>
                  <td style={{ border: '1px solid black', padding: '0.5rem' }}>{(item.price || 0).toLocaleString()} KHR</td>
                  <td style={{ border: '1px solid black', padding: '0.5rem' }}>{(item.total || 0).toLocaleString()} KHR</td>
                  <td style={{ border: '1px solid black', padding: '0.5rem' }}>{item.note || '(ប្រភេទទំនិញ)'}</td>
                </tr>
              ))}
              <tr>
                <td colSpan="5" style={{ border: '1px solid black', padding: '0.5rem', textAlign: 'right' }}>
                  សរុប
                </td>
                <td style={{ border: '1px solid black', padding: '0.5rem' }}>{(formData.total || 0).toLocaleString()} KHR</td>
                <td style={{ border: '1px solid black', padding: '0.5rem' }}></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <p>លេខសំុបញ្ជីបញ្ជាក់លើ</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem' }}>
            {formData.notes.slice(0, 8).map((note, index) => (
              <p key={index}>No({index + 1}) {note || '........................'}</p>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem', marginTop: '2rem', textAlign: 'center' }}>
          <div>
            <p>ប្រធានស្ថាប័ន</p>
            <p>ហត្ថលេខា</p>
          </div>
          <div>
            <p>ប្រធានគណនេយ្យ</p>
            <p>ហត្ថលេខា</p>
          </div>
          <div>
            <p>អ្នកធ្វើបញ្ជី</p>
            <p>{formData.preparerName || 'ហត្ថលេខា'}</p>
          </div>
          <div>
            <p>អនុម័ត</p>
            <p>ហត្ថលេខា</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;