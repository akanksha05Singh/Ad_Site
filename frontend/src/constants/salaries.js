export const SALARY_MIN_OPTIONS = [
  '5,000',
  '10,000',
  '15,000',
  '20,000',
  '25,000',
  '30,000',
  '40,000',
  '50,000',
  '75,000',
  '1,00,000',
  '1,50,000',
  '2,00,000'
];

export const SALARY_MAX_OPTIONS = [
  '10,000',
  '15,000',
  '25,000',
  '35,000',
  '45,000',
  '60,000',
  '80,000',
  '1,00,000',
  '1,50,000',
  '2,00,000',
  '3,00,000'
];

export function formatINR(amount) {
  const num = Number(String(amount || 0).replace(/[^0-9]/g, '')) || 0;
  return `₹${num.toLocaleString('en-IN')}`;
}
