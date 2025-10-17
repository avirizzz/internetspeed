import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiDownload, FiUpload, FiClock, FiRefreshCw, FiShare2, FiSave } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SpeedTest = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [ping, setPing] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentTest, setCurrentTest] = useState('');
  const [testHistory, setTestHistory] = useState([]);
  const [chartData, setChartData] = useState([]);
  const gaugeRef = useRef(null);

  // Load test history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('speedTestHistory');
    if (savedHistory) {
      setTestHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Update gauge fill based on current speed
  useEffect(() => {
    if (!gaugeRef.current) return;
    
    const speed = currentTest === 'download' ? downloadSpeed : uploadSpeed;
    const maxSpeed = 200; // Maximum speed for gauge (200 Mbps)
    const percentage = Math.min((speed / maxSpeed) * 100, 100);
    
    // Calculate the stroke-dasharray and stroke-dashoffset
    const circumference = 2 * Math.PI * 70;
    const dashOffset = circumference * (1 - percentage / 100);
    
    gaugeRef.current.style.strokeDashoffset = dashOffset;
  }, [downloadSpeed, uploadSpeed, currentTest]);

  // Simulate speed test
  const runSpeedTest = () => {
    setIsRunning(true);
    setProgress(0);
    setDownloadSpeed(0);
    setUploadSpeed(0);
    setPing(0);
    setChartData([]);
    
    // Simulate ping test
    setCurrentTest('ping');
    setTimeout(() => {
      const pingValue = Math.floor(Math.random() * 30) + 10; // 10-40ms
      setPing(pingValue);
      
      // Simulate download test
      setCurrentTest('download');
      simulateSpeedTest('download', 8000); // 8 seconds for download test
    }, 1000);
  };

  // Simulate speed test with realistic fluctuations
  const simulateSpeedTest = (type, duration) => {
    const CHART_UPDATE_MS = 500; // throttle chart updates to every 500ms
    const startTime = Date.now();
    const endTime = startTime + duration;
    const maxSpeed = type === 'download' ? 200 : 100; // Max download: 200Mbps, Max upload: 100Mbps
    const baseSpeed = type === 'download'
      ? Math.floor(Math.random() * 100) + 50 // 50-150 Mbps for download
      : Math.floor(Math.random() * 50) + 20; // 20-70 Mbps for upload

    // Local accumulator to prevent state thrashing
    let newChartData = [...chartData];

    const updateSpeed = () => {
      const now = Date.now();
      const elapsedTime = now - startTime;

      if (now >= endTime) {
        // Test complete
        if (type === 'download') {
          setCurrentTest('upload');
          simulateSpeedTest('upload', 5000);
        } else {
          const testResult = {
            id: Date.now(),
            date: new Date().toLocaleString(),
            download: downloadSpeed,
            upload: uploadSpeed,
            ping: ping,
          };

          const updatedHistory = [testResult, ...testHistory].slice(0, 10);
          setTestHistory(updatedHistory);
          localStorage.setItem('speedTestHistory', JSON.stringify(updatedHistory));

          setIsRunning(false);
          setCurrentTest('');
        }

        return;
      }

      // Calculate progress percentage
      const progressPercentage = (elapsedTime / duration) * 100;
      setProgress(progressPercentage);

      // Simulate smoother fluctuations
      const fluctuation = Math.sin(elapsedTime / 800) * 8;
      const randomFactor = (Math.random() - 0.5) * 6;
      const speedFactor = Math.min(elapsedTime / (duration * 0.4), 1);
      const calculatedSpeed = baseSpeed * speedFactor + fluctuation + randomFactor;
      const clampedSpeed = Math.max(Math.min(calculatedSpeed, maxSpeed), 0).toFixed(1);

      if (type === 'download') setDownloadSpeed(parseFloat(clampedSpeed));
      else setUploadSpeed(parseFloat(clampedSpeed));

      // update chart data (throttled)
      newChartData.push({ time: Math.round(elapsedTime / 100) / 10, [type]: parseFloat(clampedSpeed) });
      if (newChartData.length > 30) newChartData.shift();
      setChartData([...newChartData]);

      setTimeout(updateSpeed, CHART_UPDATE_MS);
    };

    updateSpeed();
  };

  // Format speed with appropriate unit
  const formatSpeed = (speed) => {
    if (speed < 1) return `${(speed * 1000).toFixed(0)} Kbps`;
    return `${speed} Mbps`;
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
        <SpeedTestCard>
          <CardHeader>
            <h2>Internet Speed Test</h2>
            <p>Test your connection speed</p>
          </CardHeader>
          
          <GaugeContainer>
            <svg viewBox="0 0 200 100" className="gauge">
              <defs>
                <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00f2fe" />
                  <stop offset="100%" stopColor="#4facfe" />
                </linearGradient>
              </defs>
              <path 
                className="gauge-background" 
                d="M20,90 A70,70 0 1,1 180,90" 
                fill="none"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <path 
                ref={gaugeRef}
                className="gauge-fill" 
                d="M20,90 A70,70 0 1,1 180,90" 
                fill="none"
                stroke="url(#gaugeGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="439.6"
                strokeDashoffset="439.6"
              />
              <text 
                x="100" 
                y="75" 
                textAnchor="middle" 
                fontSize="24" 
                fontWeight="bold"
                fill="white"
              >
                {currentTest === 'download' ? downloadSpeed : uploadSpeed}
              </text>
              <text 
                x="100" 
                y="95" 
                textAnchor="middle" 
                fontSize="12"
                fill="rgba(255, 255, 255, 0.7)"
              >
                Mbps
              </text>
            </svg>
            
            {isRunning && (
              <TestIndicator>
                <TestLabel>
                  {currentTest === 'ping' ? 'Testing Ping...' : 
                   currentTest === 'download' ? 'Download Test' : 'Upload Test'}
                </TestLabel>
                <ProgressBar>
                  <ProgressFill style={{ width: `${progress}%` }} />
                </ProgressBar>
              </TestIndicator>
            )}
          </GaugeContainer>
          
          <MetricsContainer>
            <MetricBox>
              <MetricIcon>
                <FiDownload />
              </MetricIcon>
              <MetricValue>{downloadSpeed}</MetricValue>
              <MetricLabel>Download (Mbps)</MetricLabel>
            </MetricBox>
            
            <MetricBox>
              <MetricIcon>
                <FiUpload />
              </MetricIcon>
              <MetricValue>{uploadSpeed}</MetricValue>
              <MetricLabel>Upload (Mbps)</MetricLabel>
            </MetricBox>
            
            <MetricBox>
              <MetricIcon>
                <FiClock />
              </MetricIcon>
              <MetricValue>{ping}</MetricValue>
              <MetricLabel>Ping (ms)</MetricLabel>
            </MetricBox>
          </MetricsContainer>
          
          <ChartContainer>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="time" 
                  label={{ value: 'Time (s)', position: 'insideBottomRight', offset: -5, fill: 'rgba(255,255,255,0.7)' }}
                  stroke="rgba(255,255,255,0.5)"
                />
                <YAxis 
                  label={{ value: 'Speed (Mbps)', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.7)' }}
                  stroke="rgba(255,255,255,0.5)"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                  formatter={(value) => [`${value} Mbps`]}
                  labelFormatter={(value) => `Time: ${value}s`}
                />
                <Line 
                  type="monotone" 
                  dataKey="download" 
                  stroke="#00f2fe" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="upload" 
                  stroke="#4facfe" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
          
          <ButtonContainer>
            <StartButton 
              onClick={runSpeedTest} 
              disabled={isRunning}
              whileHover={{ scale: isRunning ? 1 : 1.05 }}
              whileTap={{ scale: isRunning ? 1 : 0.95 }}
              $isRunning={isRunning}
            >
              {isRunning ? 'Testing...' : 'Start Test'}
              {!isRunning && <FiRefreshCw />}
            </StartButton>
          </ButtonContainer>
        </SpeedTestCard>
        
        <HistoryCard>
          <CardHeader>
            <h2>Test History</h2>
            <p>Your recent speed tests</p>
          </CardHeader>
          
          {testHistory.length > 0 ? (
            <HistoryList>
              {testHistory.map((test) => (
                <HistoryItem key={test.id}>
                  <HistoryDate>{test.date}</HistoryDate>
                  <HistoryMetrics>
                    <HistoryMetric>
                      <FiDownload />
                      <span>{test.download} Mbps</span>
                    </HistoryMetric>
                    <HistoryMetric>
                      <FiUpload />
                      <span>{test.upload} Mbps</span>
                    </HistoryMetric>
                    <HistoryMetric>
                      <FiClock />
                      <span>{test.ping} ms</span>
                    </HistoryMetric>
                  </HistoryMetrics>
                </HistoryItem>
              ))}
            </HistoryList>
          ) : (
            <EmptyHistory>
              <p>No test history yet</p>
              <p>Run your first speed test to see results here</p>
            </EmptyHistory>
          )}
        </HistoryCard>
      </ContentWrapper>
    </PageContainer>
  );
};

const PageContainer = styled(motion.div)`
  padding: 4rem 1rem 3rem;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 2rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 3.5rem 1rem 2.5rem;
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

const SpeedTestCard = styled(Card)`
  padding: 2rem 2.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 960px;
  width: 100%;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 1.5rem;
    gap: 1rem;
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

const GaugeContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 360px; /* slightly larger gauge */
  margin: 0 auto 0.75rem;
  
  svg {
    width: 100%;
    height: auto;
  }
`;

const TestIndicator = styled.div`
  position: absolute;
  bottom: -10px;
  left: 0;
  width: 100%;
  text-align: center;
`;

const TestLabel = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.textLight};
  margin-bottom: 0.5rem;
`;

const ProgressBar = styled.div`
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, ${({ theme }) => theme.primaryLight}, ${({ theme }) => theme.primary});
  border-radius: 2px;
  transition: width 0.3s ease;
`;

const MetricsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const MetricBox = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 1.5rem 1rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const MetricIcon = styled.div`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.primary};
  margin-bottom: 0.5rem;
`;

const MetricValue = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${({ theme }) => theme.textLight};
`;

const MetricLabel = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.textMuted};
`;

const ChartContainer = styled.div`
  width: 100%;
  height: 260px; /* increased height for clearer graph */
  background: rgba(0, 0, 0, 0.18);
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 0.75rem 0.75rem 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const StartButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: ${({ $isRunning, theme }) => 
    $isRunning 
      ? 'rgba(79, 172, 254, 0.3)'
      : `linear-gradient(90deg, ${theme.primaryLight}, ${theme.primary})`
  };
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: ${({ $isRunning }) => ($isRunning ? 'not-allowed' : 'pointer')};
  transition: all 0.3s ease;
  box-shadow: ${({ $isRunning }) => 
    $isRunning ? 'none' : '0 10px 20px rgba(0, 242, 254, 0.3)'
  };
  
  svg {
    font-size: 1.2rem;
  }
  
  &:disabled {
    opacity: 0.7;
  }
`;

const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  overflow-y: auto;
  padding-right: 0.5rem;
  
  /* Custom scrollbar for the history list */
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 2px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.primary};
    border-radius: 2px;
  }
`;

const HistoryItem = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    background: rgba(0, 0, 0, 0.3);
  }
`;

const HistoryDate = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.textMuted};
  margin-bottom: 0.5rem;
`;

const HistoryMetrics = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
`;

const HistoryMetric = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.textLight};
  
  svg {
    color: ${({ theme }) => theme.primary};
    font-size: 0.8rem;
  }
`;

const EmptyHistory = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  text-align: center;
  color: ${({ theme }) => theme.textMuted};
  
  p:first-child {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
  }
  
  p:last-child {
    font-size: 0.9rem;
  }
`;

export default SpeedTest;