from fastapi import APIRouter
from app.schemas.tool_schemas import ECQuery

router = APIRouter()

@router.post("/search")
def search_ec(query: ECQuery):
    primary_survey = query.surveyRows[0].get("surveyNumber", "142/3B") if query.surveyRows else "142/3B"
    primary_plot = query.plots[0].get("plotNumber", "Plot No. 42B") if query.plots else "Plot No. 42B"

    if query.searchMode == "document":
        records = [
            {
                "id": "EC-DOC-001",
                "documentNumber": f"Doc {query.documentNumber or '1420'} / {query.documentYear or '2021'}",
                "registrationDate": f"15-Mar-{query.documentYear or '2021'}",
                "natureOfDocument": query.documentType or "Sale Deed (Conveyance)",
                "executants": "K. Rajendran & Co-owners",
                "claimants": "S. Ananthakrishnan",
                "propertyDescription": f"{primary_plot}, Green Park Enclave, Door No. 12",
                "surveyNo": primary_survey,
                "extent": "1,450 Sq.Ft",
                "isEncumbrance": False,
                "remarks": "Registered absolute sale deed. Clean title."
            }
        ]
    else:
        records = [
            {
                "id": "EC-TX-001",
                "documentNumber": "Doc 1420 / 2021",
                "registrationDate": "15-Mar-2021",
                "natureOfDocument": "Sale Deed (Conveyance)",
                "executants": "K. Rajendran",
                "claimants": "S. Ananthakrishnan",
                "propertyDescription": f"{primary_plot}, Survey No {primary_survey}, {query.village or 'Velachery'}",
                "surveyNo": primary_survey,
                "extent": "1,450 Sq.Ft",
                "isEncumbrance": False
            },
            {
                "id": "EC-TX-002",
                "documentNumber": "Doc 890 / 2018",
                "registrationDate": "10-May-2018",
                "natureOfDocument": "Deposit of Title Deeds (Mortgage)",
                "executants": "S. Ananthakrishnan",
                "claimants": "HDFC Bank Ltd.",
                "propertyDescription": f"{primary_plot}, Survey No {primary_survey}",
                "surveyNo": primary_survey,
                "extent": "1,450 Sq.Ft",
                "isEncumbrance": True,
                "remarks": "Home loan mortgage charge. Release receipt recommended."
            }
        ]

    return {
        "success": True,
        "totalRecords": len(records),
        "data": records,
        "message": "Encumbrance Certificate ledger processed successfully."
    }