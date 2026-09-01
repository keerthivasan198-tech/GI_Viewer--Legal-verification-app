import { jsPDF } from 'jspdf';
import fs from 'fs';
import path from 'path';

const PDF_FILE_MAP = {
  'cmda-Affidavit.pdf': `PROFORMA
AFFIDAVIT FOR LOSS OF ORIGINAL RECEIPT OF SD/CD
(To be furnished on Rs.20/- Stamp Paper – duly signed and Notarized)

AFFIDAVIT

We ________________________________________________________
______________Son/daughter of ______________ , aged ______________years, residing at No.
______________________________________________________________________________
hereby solemnly affirm and sincerely state as follows:

I/We declare and sincerely state that the Planning Permission obtained for the construction of Phase-I and Phase-II of IT Park comprising 10 Blocks situated at _____________________________________________________________________________ Taluk, ______________district and obtained PP along with CC bearing No.EC/______________dated______________ and in Letter No. ______________dated

I/We further declare that I/We have remitted Caution/Security Deposit for Rs. _____________ (Rupees _________________________________________only) vide Receipt No ______________dated: ___________for the IT/Spl. building to CMDA along with STP/Security Deposits for building.

I/We assure that the said original Caution/Security Deposit receipt was misplaced and found missing and also not traceable so far. If it finds later I/we will surrender the same without fail. And also I/we am/are not made any claim whatsoever over the same in future.

The above informations given by me/us are true to the best of my knowledge, information and belief.

Solemnly affirm at Chennai
On this the _____ day of _____

In the presence of the following

Witnesses:                                                         DEPONENTS
1.
                                                                  BEFORE ME
2.`,

  'cmda-annexure-New.pdf': `ANNEXURE

FORM - I
FORMAT FOR DISPLAY OF PARTICULARS OF DEVELOPMENT PERMITTED
(MULTI - STOREYED IT BUILDINGS & SPECIAL BUILDINGS)

Development:
-----------------------------------------------------------------------------------------------------
1. Name and Address of the Promoter / Development / Owner:


2. Name and address of Architect / Licensed Surveyor Engineer:


3. Type of construction permitted as per the approved plan:


4. Details of approval:
a) Chennai Metropolitan Development Authority Planning Permission No. and Date:
b) Chennai Corporation B.L. and PPA No. and Date:
c) Local Body approval No.:


5. Details of set back space provided as per approved front:
a) Front:
b) Rear:
c) Side:
d) Side:


6. Details of number of car parking / Two wheelers parking etc, provided as per approved plan:


7. Details of provision of Transformer in Ground Floor as per approved plan:


8. Details of provisions of standby Generator Room and Meter Room as per approved plan:


9. Details of provision of Lifts as per approved plan:


10. Details of provision of Fire Safety arrangements made / to be made within the building:


11. Details of provisions of water for drinking purpose as well as other purpose:


12. Details of area of construction and usage permitted in cash floor as per approved plan:
-----------------------------------------------------------------------------------------------------
Floor Area in No. of Units                        Usage Permitted
-----------------------------------------------------------------------------------------------------
BASEMENT
-----------------------------------------------------------------------------------------------------
GROUND
-----------------------------------------------------------------------------------------------------
FIRST
-----------------------------------------------------------------------------------------------------
SECOND
-----------------------------------------------------------------------------------------------------
THIRD
-----------------------------------------------------------------------------------------------------
FOURTH
-----------------------------------------------------------------------------------------------------
FIFTH
-----------------------------------------------------------------------------------------------------

Signature of Owner / Promoter / Developer of Building

Signature of Architect / Engineer / Licensed Surveyor

Signature of Planning Authority of Chennai Metropolitan Development Authority`,

  'cmda-BankGuaranteeForCD.pdf': `PROFORMA
BANK GUARANTEE FOR CD
(To be furnished on Rs.100/- Stamp Paper – purchased by issuing Bank)

DEED OF GUARANTEE

THIS DEED OF GUARANTEE executed at Chennai on this the ……… day of …………… 201 between __________________________________________ constituted under the Banking Companies Act 1956 (Acquisititor and transfer of undertakings) represented by its Authorised Signatory ______________ Chief Manager and ______________ Assistant Manager, having its office at ______________________________________________________________________ hereinafter called and referred to as the “GUARANTOR” of the ONE PART;
and
CHENNAI METROPOLITAN DEVELOPMENT AUTHORITY a statutory body constituted under the Tamil Nadu Town and Country Planning Act, 1972 represented by its Member Secretary, having its office at No.1, Gandhi Irwin Road, Egmore, Chennai 600 008 hereinafter called and referred as “CMDA” of the OTHER PART;

The terms “GUARANTOR” and the “CMDA” shall mean and include all their respective heirs, executors, administrators, authorized officials, legal representative and assigns wherever the context so means.

WHEREAS M/s. ____________________________ A Company incorporated under the Company act having its office at ______________________________________________________________________________ hereinafter referred to as “THE APPLICANT” has applied for Planning Permission for development of the property situated at to CMDA.

WHEREAS the CMDA has directed the applicant to deposit a sum of Rs. ______________ (Rupees ____________________ only) as Caution Deposit in their letter reference No. ____________________________ dated ___________201.

AND WHEREAS the applicant has come forward to furnish Bank Guarantee for a sum of Rs. ______________ (Rupees __________________________________________only) in lieu of Caution Deposit by Cash.

NOW THIS DEED OF GUARANTEE WITNESSETH AS FOLLOWS:
1. The GUARANTOR hereby undertakes and guarantees to pay to CMDA the amount of Rs. ______________ (Rupees _________________________________________only) hereinafter referred to as the “GUARANTEED AMOUNT” for and on behalf of the applicant in the manner provided below.
2. The GUARANTEE shall be enforceable by CMDA on demand after breach of planning permission condition by M/s. ____________________________________________ before the expiry of the period specified herein.
3. This GUARANTEE shall be in force for an initial period of 5 years from the ______________ to ______________ and the guarantor undertakes to renew the same as and when a request is received from the CMDA to that effect within the initial validity period, for any further period not exceeding in all ten years.
4. The Guarantor hereby undertakes to pay, without question to the CMDA the guaranteed amount in full within three days after receipt of a letter from CMDA stating that the building put up by the applicant which is the subject matter of this Guarantee has violated its usage for which the plan sanctioned by CMDA and the building is utilized for Non-IT purpose during the period and the Guaranteed amount has thus become payable.
5. Notwithstanding anything contained above, the Guarantor hereby agrees, without question to transfer the Guaranteed amount to CMDA’s account invoking the Bank Guarantee in favour of CMDA on or before expiry of the Bank Guarantee unless Confirmation Certificate from M/s. ELCOT certifying that the construction is put into continuous usage for IT purpose for the said Five Years for refund of Caution Deposit.
6. The GUARANTOR fails to honour the guarantee as aforesaid for any reason whatsoever the Guarantor shall pay to the CMDA, interest at 24% p.a. of daily rate along with the guaranteed amount and this Guarantee shall be deemed to be valid and extended upto the date on which all the liabilities are fully discharged.
7. The executants declare that he is empowered and authorized to execute this guarantee on behalf of the GUARANTOR.
8. The GUARANTEE has been duly recorded in the books of account of the GUARANTOR and may be cited as B.G. No. ______________ issue date: ______________
9. For any dispute arising out of this guarantee the jurisdiction shall be that of the Courts of Chennai City.
10. This GUARANTEE shall be unconditional and irrevocable.

IN WITNESS WHEREOF THE GUARANTOR HAS SIGNED AND DELIVERED THIS DEED OF GUARANTEE ON THE DAY, MONTH AND YEAR FOR ABOVE WRITTEN.`,

  'cmda-BankGuaranteeForSD.pdf': `PROFORMA
BANK GUARANTEE FOR SD FOR BUILDING/STP
(To be furnished on Rs.100/- Stamp Paper – purchased by issuing Bank)

DEED OF GUARANTEE

THIS DEED OF GUARANTEE executed at Chennai on this the ……… day of …………… 201 between constituted under the Banking / Companies Act 1956 represented by its Authorised Signatory _________________ Chief Manager and _____________________ Assistant Manager, having its office at _____________________________________________________________________________. hereinafter called and referred to as the “GUARANTOR” of the ONE PART;
and
CHENNAI METROPOLITAN DEVELOPMENT AUTHORITY a statutory body constituted under the Tamil Nadu Town and Country Planning Act, 1972 represented by its Member-Secretary, having its office at No.1, Gandhi Irwin Road, Egmore, Chennai 600 008 hereinafter called and referred as “CMDA” of the OTHER PART;

The terms “GUARANTOR” and the “CMDA” shall mean and include all their respective heirs, executors, administrators, authorized officials, legal representative and assigns wherever the context so means.

WHEREAS ___________________________ having their office at _______________________________________________________________________ represented by its ___________________________ son/wife of ________________ aged about years hereinafter referred to as “THE APPLICANT” has applied for Planning Permission for development of the property situated at ____________________________________________ to CMDA.

WHEREAS the CMDA has directed the applicant to deposit a sum of Rs. ______________ (Rupees ____________________________________ only) as Security Deposit for Building/STP vide their letter reference No. ____________________ dated ____________.

AND WHEREAS the applicant has come forward to furnish Bank Guarantee for a sum of Rs. _____________ (Rupees ________________________________________ only) in lieu of Security Deposit for Building/STP to CMDA and accept Bank Guarantee in lieu of cash payment for a sum of Rs. _________________ (Rupees ________________________________________________ only) as Security Deposit for Building/STP for issue of Planning Permission in the reference number above mentioned.

NOW THIS DEED OF GUARANTEE WITNESSETH AS FOLLOWS:
1. The GUARANTOR hereby undertakes and guarantees to pay to CMDA the amount of Rs. ____________ (Rupees _________________________________________ only) hereinafter referred to as the “GUARANTEED AMOUNT” for and on behalf of the applicant in the manner provided below.
2. The GUARANTEE shall be enforceable by CMDA on demand at any time before the expiry of the period specified herein.
3. The BANK GUARANTEE in lieu of cash towards Security Deposit for the Building, Sewage Treatment (STP) and Display Board provided, the applicant remits 9% of interest advance for the total Bank Guarantee amount for a period of 5 years (PP validity period) in cash along with the Bank Guarantee.
4. The GUARANTOR fails to honour the guarantee as aforesaid for any reason whatsoever the Guarantor shall pay to the CMDA, interest at 12% p.a. of daily rate along with the guaranteed amount and this Guarantee shall be deemed to be valid and extended upto the date on which all the liabilities are fully discharged.
5. The Guarantor hereby undertakes to pay without question to the CMDA the guaranteed amount in full within three days after the receipt of a letter from CMDA, stating that the construction put up by the applicant which is the subject matter of this Guarantee is not in accordance with the plan sanctioned by CMDA and the Guaranteed amount has thus become payable.
6. Notwithstanding anything contained above, the Guarantor hereby agrees, without question to transfer the Guaranteed amount to CMDA’s account, invoking the Bank Guarantee in favour of CMDA on or before expiry of the Bank Guarantee unless or otherwise CMDA write a letter to the Guarantor Bank to discharge the Bank Guarantee amount by certifying that the Applicant had obtained the “COMPLETION CERTIFICATE” for refund of Security Deposit.`,

  'cmda-form-a.pdf': `Form-A
Application for Permission for subdivision/layout or reconstitution or amalgamation of land for building purposes. And for change of use of land

From
--------------------------
-----------------------------
------------------------------ (Affix stamp size photo graph of the applicant)

To
The Competent Authority
……………………………………………………

1. I/We hereby apply for permission for subdivision / layout or reconstitution or amalgamation of land for building purposes as described in the accompanying plans and drawings.

2. I/We have absolute right over the land applied for and have not made any encroachment on any government land.

3. The names of the persons employed by me/us for the preparation of plans, and supervision of the work are as under:
a) The plans are prepared by Registered Architect/Engineer/Town Planner ------------------- [name]
b) The execution of the development will be supervised by Registered Architect/Engineer/Town Planner-------------[name]

4. I/We have read the Building Rules applicable for the Local body wherein the site lies and claim to be fully conversant with it; I/We will abide to the provisions of the Building Rules fully.

5. I/We shall fulfill my duties and responsibility in accordance with the provisions of the Building Rules.

Date:
Signature of the Owner/Developer
Signature of Registered Professional`,

  'cmda-form-b.pdf': `Form-B
Application for Permission for carrying out construction of building or structure, change of use of building

From
--------------------------
-----------------------------
------------------------------ (Affix stamp size photo graph of the applicant)

To
The Executive Authority of Local Body
……………………………………………………

1. I/We hereby apply for permission for carrying out construction of building or structure, change of use of building as described in the accompanying plans and drawings.

2. I/We have absolute right over the land applied for and have not made any encroachment on any government land.

3. The names of the registered professionals employed by me/us for the development are as under:
a) The plans have been prepared by Registered Architect/Engineer --------------- [name and registration number]
b) The structural report, details and drawings have been prepared and supplied by the Registered Structural Engineer --------------------- [name and registration number]
c) The construction of the proposed buildings will be carried under the supervision of the Registered Construction Engineer on Record ……………(name and registration number)
d) For the foundation work of the High rise building, the services of the Registered Geo-technical Engineer ……………. (name and registration number) will be availed.
e) The construction work of a High rise building executed by Registered Construction Engineer on the record will be under the independent quality inspection programme prepared and implemented under the supervision of the independent Registered Quality Auditor on record…………… (name and registration number)

4. I/We have read the Building Rules applicable for the Local body framed under the provisions of the relevant Act and claim to be fully conversant with it.

5. I/We shall fulfill my duties and responsibility in accordance with the provisions of the Building Rules.

Signature of the Owner/Registered Developer
Date:`,

  'cmda-form-c.pdf': `FORM-C
Form of undertaking to be executed by the land owner or power of attorney holder or builder or promoter and structural engineer, architect, geo-tech expert and site engineer.

This deed of undertaking executed at ………….on the…………………day of ……………………20….. by the landowner Thiru/Tmt/Selvi …………………………………… Son/Daughter of …………………………………. aged…………………………..Residing at No.………………………………………………………………..... (or) Power of Attorney Holder (or) Builder (or) Promoter / Structural Engineer __________, Architect __________________, Geo-Tech Consultant __________________ in respect of proposed development / construction made in Door No._________, _________________ Road in the following S.No.

----------------------------------------------------------------------------------------------------
S.No. / R.S.No. / T.S.No.        Block No.             Village             Taluk
----------------------------------------------------------------------------------------------------

in favour of the ……………………………………….(competent authority) having office at ………………………………………….witnesseth as follows.

2. I/We (Land Owner or Power of Attorney Holder or Builder or Promoter) have applied for the Planning Permission for construction in the above premises by submitting an application to the ………………………………..(competent authority)in accordance with the planning norms prescribed in these rules. I am associated with the project as Land Owner/Power of Attorney Holder/Builder/Promoter. The extent of site as per document is _____ sq.m. and as per Patta / TSLR / PLR / Handing over sketch _______ sq.mt. I assure that I will put up the construction only in accordance with the approved plan without any deviation and if any construction is later on found not in accordance with the approved plan and any unauthorized addition is made, I agree for the forfeiture of the Security Deposit which will be collected while issuing Planning Permission, and also agree to demolish the such a deviation marked by the ………………………………………..(competent authority) within thirty days after such notice, failing which, apart from forfeiture of Security Deposit, the ……………………………………………………… may demolish or cause to demolish such unauthorized or deviated constructions at the site under reference and recover the cost of demolition from me.`,

  'cmda-IndemnityBond.pdf': `INDEMNITY BOND
(To be executed on Rs.100/- Stamp Paper and notarized)

WHEREAS the CMDA has required an Indemnity Bond to be executed for planning permission approval...`,

  'cmda-documenthistory.pdf': `DOCUMENT HISTORY FORM
(CMDA Planning Permission Application Enclosure)

Particulars of Previous and Present Ownership:
Village:
Block No:
Survey No / T.S. No:`,

  'cmda-InspectionReportFormatIndustrial.pdf': `INSPECTION REPORT FORMAT (INDUSTRIAL)
Chennai Metropolitan Development Authority

Industrial Building & Site Inspection Details:
1. Site Location & Road Width:
2. Effluent Treatment & Pollution Control NOC:
3. Structural Safety & Machine Capacity:`,

  'cmda-NOC.pdf': `NO OBJECTION CERTIFICATE (NOC) FOR AUTHORISATION OF SD REFUND
Chennai Metropolitan Development Authority

This is to certify that the construction at Survey No. _________ has been verified and found in accordance with sanctioned planning permission. Refund of Security Deposit is hereby authorized.`,

  'cmda-Receipt.pdf': `ADVANCED STAMPED RECEIPT
Chennai Metropolitan Development Authority

Received a sum of Rs. _____________ (Rupees _____________________________ only) from CMDA towards refund of Caution / Security Deposit.`,

  'cmda-reconstitution.pdf': `DEED OF RECONSTITUTION OF LAND
Chennai Metropolitan Development Authority

This Deed of Reconstitution executed on this day by the land owners for reconstituting plot boundaries as per CMDA layout norms.`,

  'cmda-TNCDBR-2019-RegistrationFormat.pdf': `TNCDBR-2019 REGISTRATION FORMAT
Tamil Nadu Combined Development and Building Rules, 2019

Registration format for Architect / Licensed Surveyor / Structural Engineer / Geo-Tech Expert / Site Supervision Engineer with CMDA & Local Body.`
};

const outputDir = path.resolve('public/pdfs');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

for (const [filename, text] of Object.entries(PDF_FILE_MAP)) {
  const doc = new jsPDF({
    unit: 'mm',
    format: 'a4',
    orientation: 'portrait'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const maxLineWidth = pageWidth - margin * 2;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);

  const lines = text.split('\n');
  let cursorY = 20;
  const lineHeight = 6;

  lines.forEach((rawLine) => {
    if (rawLine.trim() === '') {
      cursorY += 3;
      return;
    }
    const wrapped = doc.splitTextToSize(rawLine, maxLineWidth);
    wrapped.forEach((lineText) => {
      if (cursorY + lineHeight > pageHeight - margin) {
        doc.addPage();
        cursorY = 20;
      }
      doc.text(lineText, margin, cursorY);
      cursorY += lineHeight;
    });
  });

  const filePath = path.join(outputDir, filename);
  const pdfBuffer = doc.output('arraybuffer');
  fs.writeFileSync(filePath, Buffer.from(pdfBuffer));
  console.log(`Generated static PDF: ${filePath}`);
}
