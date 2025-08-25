import React, { useState, useEffect } from "react";

const MedicineComparisonApp = () => {
  console.log("MedicineComparisonApp component is rendering"); // Debug log
  
  const [sessionId, setSessionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [comparisonResult, setComparisonResult] = useState(null);

  // Medicine 1 (Doctor's Prescription) state
  const [medicine1Image, setMedicine1Image] = useState(null);
  const [medicine1Preview, setMedicine1Preview] = useState(null);
  const [medicine1Text, setMedicine1Text] = useState("");
  const [medicine1Processing, setMedicine1Processing] = useState(false);

  // Medicine 2 (Patient's Medicine) state
  const [medicine2Image, setMedicine2Image] = useState(null);
  const [medicine2Preview, setMedicine2Preview] = useState(null);
  const [medicine2Text, setMedicine2Text] = useState("");
  const [medicine2Processing, setMedicine2Processing] = useState(false);

  // Generate session ID once
  useEffect(() => {
    console.log("MedicineComparisonApp useEffect running"); // Debug log
    const newSessionId = "comparison_" + Date.now() + "_" + Math.floor(Math.random() * 10000);
    setSessionId(newSessionId);
  }, []);

  // Convert image to base64
  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Handle image upload for Medicine 1
  const handleMedicine1Upload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setMedicine1Image(file);
        const reader = new FileReader();
        reader.onload = (e) => setMedicine1Preview(e.target.result);
        reader.readAsDataURL(file);
      } else {
        alert('Please select a valid image file');
      }
    }
  };

  // Handle image upload for Medicine 2
  const handleMedicine2Upload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setMedicine2Image(file);
        const reader = new FileReader();
        reader.onload = (e) => setMedicine2Preview(e.target.result);
        reader.readAsDataURL(file);
      } else {
        alert('Please select a valid image file');
      }
    }
  };

  // Process Medicine 1 with Gemini API
  const processMedicine1WithGemini = async () => {
    if (!medicine1Image) return;

    setMedicine1Processing(true);
    setMedicine1Text("");

    try {
      const base64Image = await convertImageToBase64(medicine1Image);
      const base64Data = base64Image.split(',')[1];
      
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDR_74P12MU4cHV3mPlzencfWNFUQa9L4Y",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [
                {
                  text: "Extract all the text content from this medicine package/label image. Please provide only the text content without any additional formatting or explanation."
                },
                {
                  inline_data: {
                    mime_type: medicine1Image.type,
                    data: base64Data
                  }
                }
              ]
            }]
          })
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} - ${data.error?.message || 'Unknown error'}`);
      }
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
        const extractedContent = data.candidates[0].content.parts[0].text;
        if (extractedContent && extractedContent.trim()) {
          setMedicine1Text(extractedContent);
        } else {
          alert("No text found in Medicine 1 image. Please try with a clearer image.");
        }
      } else {
        alert("Could not extract text from Medicine 1 image. Please try again.");
        console.error("Gemini API response:", data);
      }

    } catch (error) {
      console.error("Error processing Medicine 1:", error);
      alert("Error processing Medicine 1 image. Please try again.");
    } finally {
      setMedicine1Processing(false);
    }
  };

  // Process Medicine 2 with Gemini API
  const processMedicine2WithGemini = async () => {
    if (!medicine2Image) return;

    setMedicine2Processing(true);
    setMedicine2Text("");

    try {
      const base64Image = await convertImageToBase64(medicine2Image);
      const base64Data = base64Image.split(',')[1];
      
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDR_74P12MU4cHV3mPlzencfWNFUQa9L4Y",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: "Extract all the text content from this medicine package/label image. Please provide only the text content without any additional formatting or explanation."
              },
              {
                inline_data: {
                  mime_type: medicine2Image.type,
                  data: base64Data
                }
              }]
            }]
          })
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} - ${data.error?.message || 'Unknown error'}`);
      }
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
        const extractedContent = data.candidates[0].content.parts[0].text;
        if (extractedContent && extractedContent.trim()) {
          setMedicine2Text(extractedContent);
        } else {
          alert("No text found in Medicine 2 image. Please try again.");
        }
      } else {
        alert("Could not extract text from Medicine 2 image. Please try again.");
        console.error("Gemini API response:", data);
      }

    } catch (error) {
      console.error("Error processing Medicine 2:", error);
      alert("Error processing Medicine 2 image. Please try again.");
    } finally {
      setMedicine2Processing(false);
    }
  };

  // Compare medicines using n8n webhook
  const compareMedicines = async () => {
    if (!medicine1Text.trim() || !medicine2Text.trim()) {
      alert("Please extract text from both medicine images before comparing.");
      return;
    }

    setLoading(true);
    setComparisonResult(null);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);

    try {
      const message = `Medicine1\n${medicine1Text}\n\nMedicine2\n${medicine2Text}`;
      
      console.log("Sending comparison request:", { sessionId, message });
      
      const response = await fetch(
        "https://satyajit1234567890.app.n8n.cloud/webhook/2f720384-27a9-4672-aa51-fdd9fdb8e6ef",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: sessionId,
            message: message,
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeout);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Response error:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Comparison response:", data);
      
      setComparisonResult(data);

    } catch (error) {
      clearTimeout(timeout);
      console.error("Error comparing medicines:", error);
      alert("Error comparing medicines. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Clear medicine data
  const clearMedicine1 = () => {
    setMedicine1Image(null);
    setMedicine1Preview(null);
    setMedicine1Text("");
  };

  const clearMedicine2 = () => {
    setMedicine2Image(null);
    setMedicine2Preview(null);
    setMedicine2Text("");
  };

  const clearAll = () => {
    clearMedicine1();
    clearMedicine2();
    setComparisonResult(null);
  };

  return (
    <div style={{
      maxWidth: "1400px",
      margin: "0 auto",
      padding: "20px",
      fontFamily: "Arial, sans-serif"
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: "#0078d7",
        color: "white",
        padding: "20px",
        borderRadius: "10px 10px 0 0",
        textAlign: "center",
        fontSize: "24px",
        fontWeight: "bold"
      }}>
        Medicine Comparison Tool - Doctor vs Patient
      </div>

      {/* Split Window Container */}
      <div style={{
        display: "flex",
        gap: "20px",
        backgroundColor: "#f9f9f9",
        border: "1px solid #ccc",
        borderTop: "none",
        padding: "20px"
      }}>
        {/* Medicine 1 - Doctor's Prescription */}
        <div style={{
          flex: 1,
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "20px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>
          <h3 style={{
            margin: "0 0 15px 0",
            color: "#28a745",
            fontSize: "18px",
            fontWeight: "bold",
            textAlign: "center"
          }}>
            Medicine 1 - Doctor's Prescription
          </h3>

          <div style={{ marginBottom: "15px" }}>
            <label style={{
              backgroundColor: "#28a745",
              color: "white",
              padding: "10px 15px",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
              display: "inline-block"
            }}>
              Upload Doctor's Medicine Image
              <input
                type="file"
                accept="image/*"
                onChange={handleMedicine1Upload}
                style={{ display: "none" }}
              />
            </label>
          </div>

          {medicine1Preview && (
            <div style={{ marginBottom: "15px" }}>
              <img
                src={medicine1Preview}
                alt="Medicine 1 preview"
                style={{
                  width: "100%",
                  maxHeight: "200px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  border: "2px solid #ddd"
                }}
              />
            </div>
          )}

          {medicine1Image && (
            <div style={{ marginBottom: "15px", textAlign: "center" }}>
              <button
                onClick={processMedicine1WithGemini}
                disabled={medicine1Processing}
                style={{
                  backgroundColor: "#ff6b35",
                  color: "white",
                  border: "none",
                  padding: "10px 15px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  width: "100%"
                }}
              >
                {medicine1Processing ? "Processing..." : "Extract Text with AI"}
              </button>
            </div>
          )}

          {medicine1Text && (
            <div style={{ marginBottom: "15px" }}>
              <h4 style={{
                margin: "0 0 10px 0",
                color: "#333",
                fontSize: "16px",
                fontWeight: "bold"
              }}>
                Extracted Text:
              </h4>
              <div style={{
                backgroundColor: "#f8f9fa",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #dee2e6",
                fontSize: "14px",
                lineHeight: "1.5",
                color: "#333",
                maxHeight: "150px",
                overflowY: "auto"
              }}>
                {medicine1Text}
              </div>
              <button
                onClick={clearMedicine1}
                style={{
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "12px",
                  marginTop: "10px"
                }}
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Medicine 2 - Patient's Medicine */}
        <div style={{
          flex: 1,
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "20px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>
          <h3 style={{
            margin: "0 0 15px 0",
            color: "#dc3545",
            fontSize: "18px",
            fontWeight: "bold",
            textAlign: "center"
          }}>
            Medicine 2 - Patient's Medicine
          </h3>

          <div style={{ marginBottom: "15px" }}>
            <label style={{
              backgroundColor: "#dc3545",
              color: "white",
              padding: "10px 15px",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
              display: "inline-block"
            }}>
              Upload Patient's Medicine Image
              <input
                type="file"
                accept="image/*"
                onChange={handleMedicine2Upload}
                style={{ display: "none" }}
              />
            </label>
          </div>

          {medicine2Preview && (
            <div style={{ marginBottom: "15px" }}>
              <img
                src={medicine2Preview}
                alt="Medicine 2 preview"
                style={{
                  width: "100%",
                  maxHeight: "200px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  border: "2px solid #ddd"
                }}
              />
            </div>
          )}

          {medicine2Image && (
            <div style={{ marginBottom: "15px", textAlign: "center" }}>
              <button
                onClick={processMedicine2WithGemini}
                disabled={medicine2Processing}
                style={{
                  backgroundColor: "#ff6b35",
                  color: "white",
                  border: "none",
                  padding: "10px 15px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  width: "100%"
                }}
              >
                {medicine2Processing ? "Processing..." : "Extract Text with AI"}
              </button>
            </div>
          )}

          {medicine2Text && (
            <div style={{ marginBottom: "15px" }}>
              <h4 style={{
                margin: "0 0 10px 0",
                color: "#333",
                fontSize: "16px",
                fontWeight: "bold"
              }}>
                Extracted Text:
              </h4>
              <div style={{
                backgroundColor: "#f8f9fa",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #dee2e6",
                fontSize: "14px",
                lineHeight: "1.5",
                color: "#333",
                maxHeight: "150px",
                overflowY: "auto"
              }}>
                {medicine2Text}
              </div>
              <button
                onClick={clearMedicine2}
                style={{
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "12px",
                  marginTop: "10px"
                }}
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{
        backgroundColor: "#f9f9f9",
        border: "1px solid #ccc",
        borderTop: "none",
        padding: "20px",
        textAlign: "center"
      }}>
        <button
          onClick={compareMedicines}
          disabled={!medicine1Text.trim() || !medicine2Text.trim() || loading}
          style={{
            padding: "15px 40px",
            border: "none",
            backgroundColor: "#0078d7",
            color: "white",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
            borderRadius: "8px",
            marginRight: "15px"
          }}
        >
          {loading ? "Comparing..." : "Compare Medicines"}
        </button>

        <button
          onClick={clearAll}
          style={{
            padding: "15px 40px",
            border: "2px solid #dc3545",
            backgroundColor: "white",
            color: "#dc3545",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
            borderRadius: "8px"
          }}
        >
          Clear All
        </button>
      </div>

      {/* Results Section */}
      <div style={{
        backgroundColor: "#f9f9f9",
        border: "1px solid #ccc",
        borderTop: "none",
        borderRadius: "0 0 10px 10px",
        minHeight: "300px",
        padding: "20px"
      }}>
        {loading && (
          <div style={{
            textAlign: "center",
            padding: "50px",
            fontSize: "18px",
            color: "#666"
          }}>
            Analyzing and comparing medicines...
          </div>
        )}

        {(medicine1Processing || medicine2Processing) && (
          <div style={{
            textAlign: "center",
            padding: "50px",
            fontSize: "18px",
            color: "#666"
          }}>
            AI is reading medicine image{medicine1Processing && medicine2Processing ? "s" : ""}...
          </div>
        )}

        {!loading && !medicine1Processing && !medicine2Processing && !comparisonResult && (
          <div style={{
            textAlign: "center",
            padding: "50px",
            fontSize: "18px",
            color: "#666"
          }}>
            Upload both medicine images, extract text, and click "Compare Medicines" to see the analysis.
          </div>
        )}

        {!loading && !medicine1Processing && !medicine2Processing && comparisonResult && (
          <div style={{
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
          }}>
            <h3 style={{
              margin: "0 0 20px 0",
              color: "#0078d7",
              fontSize: "20px",
              fontWeight: "bold",
              textAlign: "center"
            }}>
              Medicine Comparison Results
            </h3>
            
            <div style={{
              backgroundColor: "#f8f9fa",
              padding: "15px",
              borderRadius: "8px",
              border: "1px solid #dee2e6"
            }}>
              <pre style={{
                fontSize: "14px",
                lineHeight: "1.6",
                color: "#333",
                margin: 0,
                whiteSpace: "pre-wrap",
                fontFamily: "Arial, sans-serif"
              }}>
                {JSON.stringify(comparisonResult, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicineComparisonApp;

// Feature configuration for the dashboard
export const medicineComparisonFeature = {
  id: 'medicine-comparison',
  title: 'Medicine Comparison',
  description: 'Compare medicines by uploading images and extracting text with AI',
  component: MedicineComparisonApp,
  icon: '🔍',
  category: 'medication',
  status: 'active'
};