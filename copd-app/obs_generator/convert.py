import json
from fhir.resources.observation import Observation
from fhir.resources.quantity import Quantity
from fhir.resources.codeableconcept import CodeableConcept
from fhir.resources.coding import Coding
from datetime import datetime
import pytz
from decimal import Decimal


# Function to create heart rate observation
def create_heart_rate_observation(data_point, patientid):
    return Observation(
        status="final",
        category=[{
            "coding": [{
                "system": "http://terminology.hl7.org/CodeSystem/observation-category",
                "code": "vital-signs",
                "display": "Vital Signs"
            }]
        }],
        code=CodeableConcept(
            coding=[Coding(system="http://loinc.org", code="8867-4", display="Heart rate")],
            text="Heart rate"
        ),
        subject={"reference": "Patient/" + str(patientid)},
        effectiveDateTime=parse_datetime_with_timezone(data_point["effectiveDateTime"]),
        valueQuantity=Quantity(
            value=float(data_point["heartRate"]),  # Ensure float for heartRate
            unit="beats/minute",
            system="http://unitsofmeasure.org",
            code="/min"
        )
    )

# Function to create oxygen saturation observation
def create_oxygen_saturation_observation(data_point, patientid):
    return Observation(
        status="final",
        category=[{
            "coding": [{
                "system": "http://terminology.hl7.org/CodeSystem/observation-category",
                "code": "vital-signs",
                "display": "Vital Signs"
            }]
        }],
        code=CodeableConcept(
            coding=[Coding(system="http://loinc.org", code="59408-5", display="Oxygen saturation in Arterial blood by Pulse oximetry")],
            text="Oxygen saturation"
        ),
        subject={"reference": "Patient/" + str(patientid)},
        effectiveDateTime=parse_datetime_with_timezone(data_point["effectiveDateTime"]),
        valueQuantity=Quantity(
            value=float(data_point["oxygenSaturation"]),  # Ensure float for oxygenSaturation
            unit="%",
            system="http://unitsofmeasure.org",
            code="%"
        )
    )

# Function to create steps observation
def create_steps_observation(data_point, patientid):
    return Observation(
        status="final",
        category=[{
            "coding": [{
                "system": "http://terminology.hl7.org/CodeSystem/observation-category",
                "code": "activity",
                "display": "Physical activity"
            }]
        }],
        code=CodeableConcept(
            coding=[Coding(system="http://loinc.org", code="41950-7", display="Number of steps in 24 hour Measured")],
            text="Number of steps"
        ),
        subject={"reference": "Patient/" + str(patientid)},
        effectiveDateTime=parse_datetime_with_timezone(data_point["effectiveDateTime"]),
        valueQuantity=Quantity(
            value=int(data_point["steps"]),  # Ensure int for steps
            unit="steps",
            system="http://unitsofmeasure.org",
            code="steps"
        )
    )

# JSON encoder to handle Decimal and datetime objects
class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)  # Convert Decimal to float
        if isinstance(obj, datetime):
            return obj.isoformat()  # Convert datetime to ISO format
        return super(DecimalEncoder, self).default(obj)

# Function to parse date with timezone
def parse_datetime_with_timezone(dt_str):
    naive_dt = datetime.strptime(dt_str, "%Y-%m-%dT%H:%M:%S.%f")
    # utc_dt = naive_dt.replace(tzinfo=pytz.timezone('Australia/Brisbane'))  # Change to Brisbane timezone
    return naive_dt

# Function to convert monitoring data to FHIR observations
def convert_to_fhir_observations(data, patientid):
    fhir_observations = []
    for data_point in data:
        # Create heart rate observation
        heart_rate_obs = create_heart_rate_observation(data_point, patientid)
        fhir_observations.append(heart_rate_obs)

        # Create steps observation
        steps_obs = create_steps_observation(data_point, patientid)
        fhir_observations.append(steps_obs)

        # Create oxygen saturation observation
        oxygen_saturation_obs = create_oxygen_saturation_observation(data_point, patientid)
        fhir_observations.append(oxygen_saturation_obs)

    return fhir_observations


# Function to handle the conversion and saving
def process_file(input_file, output_file, patientid):
    # Load monitoring data from input file
    with open(input_file, 'r') as f:
        monitoring_data = json.load(f)

    # Convert monitoring data to FHIR observations
    fhir_observations = convert_to_fhir_observations(monitoring_data, patientid)

    # Write the JSON output to a file
    with open(output_file, 'w') as f:
        # Write file header
        f.write('{\n')
        f.write('  "resourceType": "Bundle",\n')
        f.write('  "type": "transaction",\n')
        f.write('  "entry": [\n')
        for i, obs in enumerate(fhir_observations):
            obs_dict = obs.dict()  # Convert FHIR Observation object to dict
            entry = {
                # Write resource header & request method
                "resource": obs_dict,
                "request": {
                    "method": "POST",
                    "url": "Observation"
                }
            }
            f.write(json.dumps(entry, cls=DecimalEncoder, indent=2))  # Write each observation with indent
            # Format output file
            if i < len(fhir_observations) - 1:
                f.write(',')  # Add a comma between observations
            f.write('\n')  # Ensure newline between observations
        f.write('  ]\n')
        f.write('}\n')

def run(patientid):
    # Process the three files
    process_file('generated/observations_high.json', f'convert/fhir_obs_{patientid}_high.json', patientid)
    process_file('generated/observations_low.json', f'convert/fhir_obs_{patientid}_low.json', patientid)
    process_file('generated/observations_medium.json', f'convert/fhir_obs_{patientid}_medium.json', patientid)


# Define Patientid which convert for
# patientid = "copd-pat-5"
# run(patientid)
