import httpx
import json
import io

BASE_URL = "http://127.0.0.1:8001/api/v1"

def test_full_pipeline():
    print("=== STARTING LIVE END-TO-END PIPELINE TEST ===")

    client = httpx.Client(base_url=BASE_URL, timeout=30.0)

    # 1. Fetch sample data
    print("\n[Step 1] Fetching sample data from /dashboard/sample-data...")
    resp = client.get("/dashboard/sample-data")
    assert resp.status_code == 200, f"Failed: {resp.text}"
    sample = resp.json()
    print(" -> Sample job title:", sample["job_title"])

    # 2. Upload resume
    print("\n[Step 2] Uploading sample resume to /resumes/upload...")
    from docx import Document
    doc = Document()
    for line in sample["sample_resume"].splitlines():
        if line.strip():
            doc.add_paragraph(line.strip())
    
    docx_stream = io.BytesIO()
    doc.save(docx_stream)
    docx_bytes = docx_stream.getvalue()

    files = {"file": ("Alexander_Wright_Resume.docx", docx_bytes, "application/vnd.openxmlformats-officedocument.wordprocessingml.document")}
    upload_resp = client.post("/resumes/upload", files=files)
    assert upload_resp.status_code == 201, f"Upload failed: {upload_resp.text}"
    resume_data = upload_resp.json()["data"]
    resume_id = resume_data["id"]
    print(f" -> Upload Success! Resume ID: {resume_id}")
    print(f" -> Candidate Name: {resume_data['analysis']['candidate_name']}")
    print(f" -> ATS Resume Score: {resume_data['analysis']['resume_score']}%")
    print(f" -> Detected Technical Skills: {resume_data['analysis']['technical_skills']}")
    print(f" -> Detected Tools: {resume_data['analysis']['tools_and_technologies']}")

    # 3. Quick Compare with Target Job
    print("\n[Step 3] Running Match Analysis against target job description...")
    match_payload = {
        "resume_id": resume_id,
        "job_title": sample["job_title"],
        "company": sample["company"],
        "job_text": sample["sample_job"]
    }
    match_resp = client.post("/matches/quick-compare", json=match_payload)
    assert match_resp.status_code == 201, f"Match failed: {match_resp.text}"
    match_data = match_resp.json()["data"]
    match_id = match_data["id"]
    print(f" -> Overall Match Percentage: {match_data['overall_match_percentage']}%")
    print(f" -> Formula: {match_data['score_breakdown']['formula_explanation']}")
    print(f" -> Matching Skills: {match_data['matching_skills']}")
    print(f" -> Missing Skills: {match_data['missing_skills']}")
    print(f" -> Relevant Projects: {len(match_data['relevant_projects'])} matched")

    # 4. Fetch Skill Gaps
    print(f"\n[Step 4] Fetching Skill Gaps for Match ID: {match_id}...")
    gaps_resp = client.get(f"/matches/{match_id}/skill-gaps")
    assert gaps_resp.status_code == 200, f"Failed: {gaps_resp.text}"
    gaps_data = gaps_resp.json()["data"]
    print(f" -> Total Gaps: {gaps_data['total_gaps']}")
    print(f" -> Critical: {gaps_data['critical_gaps_count']} | High: {gaps_data['high_gaps_count']}")
    print(f" -> Categories identified: {list(gaps_data['categories'].keys())}")

    # 5. Fetch Dashboard Overview
    print("\n[Step 5] Checking Platform Dashboard Overview telemetry...")
    dash_resp = client.get("/dashboard/overview")
    assert dash_resp.status_code == 200, f"Failed: {dash_resp.text}"
    dash_data = dash_resp.json()["data"]
    print(f" -> Total Resumes in DB: {dash_data['total_resumes']}")
    print(f" -> Total Matches in DB: {dash_data['total_matches']}")
    print(f" -> Average Match Score: {dash_data['average_match_score']}%")
    print(f" -> Recent Matches: {len(dash_data['recent_matches'])}")

    # 6. Verify Delete Resume (GDPR Privacy)
    print("\n[Step 6] Testing Privacy / GDPR Data Purge...")
    del_resp = client.delete(f"/resumes/{resume_id}")
    assert del_resp.status_code == 200, f"Delete failed: {del_resp.text}"
    print(f" -> Resume {resume_id} and all cascaded data successfully purged!")

    # Verify 404 on purged resume
    check_purged = client.get(f"/resumes/{resume_id}")
    assert check_purged.status_code == 404, "Purged resume still accessible!"
    print(" -> Verified 404 confirmation on purged record.")

    print("\n=== ALL LIVE END-TO-END PIPELINE TESTS PASSED! ===")

if __name__ == "__main__":
    test_full_pipeline()
