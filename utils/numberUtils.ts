export function numberToWords(num: number): string {
  const a = [
    '', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ',
    'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const n = num.toString().split('.');
  let str = '';
  
  // Integer part
  const numStr = ('000000000' + n[0]).substr(-9);
  const crores = numStr.substr(0, 2);
  const lakhs = numStr.substr(2, 2);
  const thousands = numStr.substr(4, 2);
  const hundreds = numStr.substr(6, 1);
  const tens = numStr.substr(7, 2);

  if (parseInt(crores) > 0) str += convertGroup(crores) + 'Crore ';
  if (parseInt(lakhs) > 0) str += convertGroup(lakhs) + 'Lakh ';
  if (parseInt(thousands) > 0) str += convertGroup(thousands) + 'Thousand ';
  if (parseInt(hundreds) > 0) str += convertGroup(hundreds) + 'Hundred ';
  if (parseInt(tens) > 0) str += convertGroup(tens);

  // Decimal part (Paisa)
  if (n.length > 1) {
    const paisa = parseInt(n[1].substring(0, 2).padEnd(2, '0'));
    if (paisa > 0) {
      str += 'and ' + convertGroup(paisa.toString()) + 'Paise';
    }
  }

  return str.trim();
}

function convertGroup(n: string): string {
  const num = parseInt(n);
  if (num === 0) return '';
  const a = [
    '', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ',
    'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  if (num < 20) return a[num];
  const digit1 = Math.floor(num / 10);
  const digit2 = num % 10;
  return b[digit1] + ' ' + a[digit2];
}
