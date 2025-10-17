import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiDownload, FiUpload, FiClock, FiHardDrive, FiWifi, FiInfo } from 'react-icons/fi';

const TimeCalculator = () => {
  const [fileSize, setFileSize] = useState(1);
  const [sizeUnit, setSizeUnit] = useState('MB');
  const [transferType, setTransferType] = useState('download');
  const [internetSpeed, setInternetSpeed] = useState(100);
  const [speedUnit, setSpeedUnit] = useState('Mbps');
  const [calculationResult, setCalculationResult] = useState(null);
  const [recentCalculations, setRecentCalculations] = useState([]);

  // Load recent calculations from localStorage on component mount
  useEffect(() => {
    const savedCalculations = localStorage.getItem('timeCalculatorHistory');
    if (savedCalculations) {
      setRecentCalculations(JSON.parse(savedCalculations));
    }
  }, []);

  // Calculate transfer time
  const calculateTime = () => {
    // Convert file size to bits
    let sizeInBits = fileSize;
    switch (sizeUnit) {
      case 'KB':
        sizeInBits *= 8 * 1000;
        break;
      case 'MB':
        sizeInBits *= 8 * 1000 * 1000;
        break;
      case 'GB':
        sizeInBits *= 8 * 1000 * 1000 * 1000;
        break;
      case 'TB':
        sizeInBits *= 8 * 1000 * 1000 * 1000 * 1000;
        break;
      default:
        break;
    }
    
    // Convert speed to bits per second
    let speedInBitsPerSecond = internetSpeed;
    if (speedUnit === 'Mbps') {
      speedInBitsPerSecond *= 1000 * 1000;
    } else if (speedUnit === 'Kbps') {
      speedInBitsPerSecond *= 1000;
    } else if (speedUnit === 'Gbps') {
      speedInBitsPerSecond *= 1000 * 1000 * 1000;
    }
    
    // Calculate time in seconds
    const timeInSeconds = sizeInBits / speedInBitsPerSecond;
    
    // Format the result
    const result = formatTime(timeInSeconds);
    
    // Create result object
    const calculationData = {
      id: Date.now(),
      fileSize,
      sizeUnit,
      transferType,
      internetSpeed,
      speedUnit,
      result,
      timestamp: new Date().toLocaleString()
    };
    
    // Update state
    setCalculationResult(result);
    
    // Save to recent calculations
    const updatedCalculations = [calculationData, ...recentCalculations].slice(0, 10);
    setRecentCalculations(updatedCalculations);
    localStorage.setItem('timeCalculatorHistory', JSON.stringify(updatedCalculations));
  };

  // Format time in seconds to a readable format
  const formatTime = (seconds) => {
    if (seconds < 0.001) {
      return 'Less than 1 millisecond';
    }
    
    if (seconds < 1) {
      return `${Math.round(seconds * 1000)} milliseconds`;
    }
    
    if (seconds < 60) {
      return `${seconds.toFixed(1)} seconds`;
    }
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    
    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours < 24) {
      return `${hours} hour${hours !== 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
    }
    
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    
    return `${days} day${days !== 1 ? 's' : ''} ${remainingHours} hour${remainingHours !== 1 ? 's' : ''}`;
  };

  // Format file size with appropriate unit
  const formatFileSize = (size, unit) => {
    return `${size} ${unit}`;
  };

  // Page transition variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  return (
    <PageContainer
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <ContentWrapper>
        <CalculatorCard>
          <CardHeader>
            <h2>Transfer Time Calculator</h2>
            <p>Calculate how long it will take to transfer your files</p>
          </CardHeader>
          
          <FormContainer>
            <FormGroup>
              <FormLabel>
                <FiHardDrive />
                <span>File Size</span>
              </FormLabel>
              <InputGroup>
                <SizeInput 
                  type="number" 
                  value={fileSize}
                  onChange={(e) => setFileSize(parseFloat(e.target.value) || 0)}
                  min="0.01"
                  step="0.01"
                />
                <UnitSelect 
                  value={sizeUnit}
                  onChange={(e) => setSizeUnit(e.target.value)}
                >
                  <option value="KB">KB</option>
                  <option value="MB">MB</option>
                  <option value="GB">GB</option>
                  <option value="TB">TB</option>
                </UnitSelect>
              </InputGroup>
            </FormGroup>
            
            <FormGroup>
              <FormLabel>
                <FiWifi />
                <span>Transfer Type</span>
              </FormLabel>
              <RadioGroup>
                <RadioLabel>
                  <RadioInput 
                    type="radio" 
                    name="transferType" 
                    value="download"
                    checked={transferType === 'download'}
                    onChange={() => setTransferType('download')}
                  />
                  <RadioButton>
                    <RadioIcon>
                      <FiDownload />
                    </RadioIcon>
                    <span>Download</span>
                  </RadioButton>
                </RadioLabel>
                
                <RadioLabel>
                  <RadioInput 
                    type="radio" 
                    name="transferType" 
                    value="upload"
                    checked={transferType === 'upload'}
                    onChange={() => setTransferType('upload')}
                  />
                  <RadioButton>
                    <RadioIcon>
                      <FiUpload />
                    </RadioIcon>
                    <span>Upload</span>
                  </RadioButton>
                </RadioLabel>
              </RadioGroup>
            </FormGroup>
            
            <FormGroup>
              <FormLabel>
                <FiWifi />
                <span>Internet Speed</span>
              </FormLabel>
              <InputGroup>
                <SizeInput 
                  type="number" 
                  value={internetSpeed}
                  onChange={(e) => setInternetSpeed(parseFloat(e.target.value) || 0)}
                  min="0.1"
                  step="0.1"
                />
                <UnitSelect 
                  value={speedUnit}
                  onChange={(e) => setSpeedUnit(e.target.value)}
                >
                  <option value="Kbps">Kbps</option>
                  <option value="Mbps">Mbps</option>
                  <option value="Gbps">Gbps</option>
                </UnitSelect>
              </InputGroup>
            </FormGroup>
            
            <CalculateButton 
              onClick={calculateTime}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Calculate Transfer Time
            </CalculateButton>
          </FormContainer>
          
          {calculationResult && (
            <ResultContainer 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ResultIcon>
                <FiClock />
              </ResultIcon>
              <ResultText>
                <ResultTitle>
                  Estimated Transfer Time
                </ResultTitle>
                <ResultValue>
                  {calculationResult}
                </ResultValue>
                <ResultDetails>
                  {transferType === 'download' ? 'Downloading' : 'Uploading'} {formatFileSize(fileSize, sizeUnit)} at {internetSpeed} {speedUnit}
                </ResultDetails>
              </ResultText>
            </ResultContainer>
          )}
          
          <InfoBox>
            <FiInfo />
            <p>
              This calculator provides an estimate based on your input. Actual transfer times may vary due to network conditions, overhead, and other factors.
            </p>
          </InfoBox>
        </CalculatorCard>
        
        <HistoryCard>
          <CardHeader>
            <h2>Recent Calculations</h2>
            <p>Your calculation history</p>
          </CardHeader>
          
          {recentCalculations.length > 0 ? (
            <CalculationList>
              {recentCalculations.map((calc) => (
                <CalculationItem key={calc.id}>
                  <CalculationHeader>
                    <CalculationTime>{calc.timestamp}</CalculationTime>
                    <CalculationTypeIcon>
                      {calc.transferType === 'download' ? <FiDownload /> : <FiUpload />}
                    </CalculationTypeIcon>
                  </CalculationHeader>
                  
                  <CalculationDetails>
                    <CalculationDetail>
                      <span>File Size:</span>
                      <span>{formatFileSize(calc.fileSize, calc.sizeUnit)}</span>
                    </CalculationDetail>
                    
                    <CalculationDetail>
                      <span>Speed:</span>
                      <span>{calc.internetSpeed} {calc.speedUnit}</span>
                    </CalculationDetail>
                    
                    <CalculationDetail>
                      <span>Time:</span>
                      <span>{calc.result}</span>
                    </CalculationDetail>
                  </CalculationDetails>
                </CalculationItem>
              ))}
            </CalculationList>
          ) : (
            <EmptyHistory>
              <p>No calculations yet</p>
              <p>Your calculation history will appear here</p>
            </EmptyHistory>
          )}
        </HistoryCard>
      </ContentWrapper>
    </PageContainer>
  );
};

const PageContainer = styled(motion.div)`
  padding: 6rem 1rem 2rem;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 100vh;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 5rem 1rem 2rem;
  }
`;

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 1.5rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: ${({ theme }) => theme.card};
  border-radius: ${({ theme }) => theme.borderRadiusLg};
  border: 1px solid ${({ theme }) => theme.cardBorder};
  box-shadow: ${({ theme }) => theme.cardShadow};
  backdrop-filter: ${({ theme }) => theme.blur};
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
  }
`;

const CalculatorCard = styled(Card)`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 1.5rem;
    gap: 1.5rem;
  }
`;

const HistoryCard = styled(Card)`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  max-height: 800px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    max-height: 400px;
  }
`;

const CardHeader = styled.div`
  text-align: center;
  margin-bottom: 1rem;
  
  h2 {
    font-size: 1.8rem;
    font-weight: 700;
    background: linear-gradient(90deg, ${({ theme }) => theme.primaryLight}, ${({ theme }) => theme.primary});
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: ${({ theme }) => theme.textMuted};
    font-size: 1rem;
  }
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FormLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  color: ${({ theme }) => theme.textLight};
  
  svg {
    color: ${({ theme }) => theme.primary};
  }
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
`;

const SizeInput = styled.input`
  flex: 1;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.borderRadiusSm} 0 0 ${({ theme }) => theme.borderRadiusSm};
  padding: 0.75rem 1rem;
  color: ${({ theme }) => theme.textLight};
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 2px rgba(79, 172, 254, 0.2);
  }
  
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const UnitSelect = styled.select`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-left: none;
  border-radius: 0 ${({ theme }) => theme.borderRadiusSm} ${({ theme }) => theme.borderRadiusSm} 0;
  padding: 0.75rem 1rem;
  color: ${({ theme }) => theme.textLight};
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 2px rgba(79, 172, 254, 0.2);
  }
  
  option {
    background: ${({ theme }) => theme.backgroundDark};
  }
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const RadioLabel = styled.label`
  flex: 1;
  cursor: pointer;
`;

const RadioInput = styled.input`
  display: none;
  
  &:checked + div {
    background: rgba(79, 172, 254, 0.15);
    border-color: ${({ theme }) => theme.primary};
    
    svg {
      color: ${({ theme }) => theme.primaryLight};
    }
  }
`;

const RadioButton = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(0, 0, 0, 0.3);
  }
`;

const RadioIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.textMuted};
  font-size: 1.2rem;
  transition: color 0.3s ease;
`;

const CalculateButton = styled(motion.button)`
  background: linear-gradient(90deg, ${({ theme }) => theme.primaryLight}, ${({ theme }) => theme.primary});
  color: ${({ theme }) => theme.textDark};
  border: none;
  padding: 0.75rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  box-shadow: 0 6px 18px rgba(79, 172, 254, 0.12);
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ResultContainer = styled(motion.div)`
  display: flex;
  gap: 1rem;
  align-items: center;
  background: ${({ theme }) => theme.backgroundLight};
  padding: 1rem;
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  border: 1px solid ${({ theme }) => theme.cardBorder};
`;

const ResultIcon = styled.div`
  font-size: 2rem;
  color: ${({ theme }) => theme.primary};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ResultText = styled.div``;

const ResultTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  color: ${({ theme }) => theme.textLight};
`;

const ResultValue = styled.p`
  margin: 0.25rem 0 0;
  font-size: 1.25rem;
  font-weight: 700;
`;

const ResultDetails = styled.p`
  margin: 0.25rem 0 0;
  color: ${({ theme }) => theme.textMuted};
  font-size: 0.9rem;
`;

const InfoBox = styled.div`
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
  color: ${({ theme }) => theme.textMuted};
`;

export default TimeCalculator;