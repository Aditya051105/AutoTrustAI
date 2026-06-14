from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required

from .models import Vehicle, VehicleImage, PricePrediction, TrustScore
from .forms import VehicleForm
from ml_engine.predict_price import predict_vehicle_price
from ml_engine.trust_score import calculate_trust_score
from reportlab.pdfgen import canvas
from django.http import HttpResponse

import pandas as pd
import plotly.express as px
from .models import TrustScore

from .models import RepairCost
from ml_engine.repair_cost import estimate_repair_cost
@login_required
def add_vehicle(request):

    if request.method == "POST":

        form = VehicleForm(request.POST)

        if form.is_valid():

            vehicle = form.save(commit=False)

            vehicle.owner = request.user

            vehicle.save()
            
            images = request.FILES.getlist('images')

            for image in images:

                VehicleImage.objects.create(
                    vehicle=vehicle,
                    image=image
                )

            return redirect('vehicle_list')

    else:

        form = VehicleForm()

    return render(
        request,
        'vehicle_form.html',
        {'form': form}
    )


@login_required
def vehicle_list(request):

    vehicles = Vehicle.objects.filter(
        owner=request.user
    )

    return render(
        request,
        'vehicle_list.html',
        {'vehicles': vehicles}
    )


@login_required
def vehicle_detail(request, pk):

    vehicle = get_object_or_404(
        Vehicle,
        pk=pk
    )

    images = vehicle.images.all()

    prediction = PricePrediction.objects.filter(
        vehicle=vehicle
    ).first()
    trust = TrustScore.objects.filter(
        vehicle=vehicle
    ).first()
    
    repair = RepairCost.objects.filter(
    vehicle=vehicle
    ).first()
    

    return render(
        request,
        'vehicle_detail.html',
        {
            'vehicle': vehicle,
            'images': images,
            'prediction': prediction,
            'trust': trust,
            'repair': repair
        }
    )
    
@login_required
def predict_price(request, pk):

    vehicle = get_object_or_404(
        Vehicle,
        pk=pk
    )

    predicted_price = predict_vehicle_price(vehicle)

    prediction, created = PricePrediction.objects.update_or_create(
        vehicle=vehicle,
        defaults={
            'predicted_price': predicted_price,
            'confidence_score': 84
        }
    )

    return redirect(
        'vehicle_detail',
        pk=vehicle.id
    )
    
@login_required
def generate_trust_score(request, pk):

    vehicle = get_object_or_404(
        Vehicle,
        pk=pk
    )

    score, risk, recommendation = calculate_trust_score(
        vehicle
    )

    TrustScore.objects.update_or_create(
        vehicle=vehicle,
        defaults={
            'score': score,
            'risk_level': risk,
            'recommendation': recommendation
        }
    )

    return redirect(
        'vehicle_detail',
        pk=vehicle.id
    )
    
    
@login_required
def generate_report(request, pk):

    vehicle = get_object_or_404(
        Vehicle,
        pk=pk
    )

    prediction = PricePrediction.objects.filter(
        vehicle=vehicle
    ).first()

    trust = TrustScore.objects.filter(
        vehicle=vehicle
    ).first()

    response = HttpResponse(
        content_type='application/pdf'
    )

    response[
        'Content-Disposition'
    ] = f'attachment; filename="report_{vehicle.id}.pdf"'

    p = canvas.Canvas(response)

    y = 800

    p.drawString(200, y, "AUTOTRUST AI REPORT")

    y -= 50

    p.drawString(50, y, f"Brand: {vehicle.brand}")
    y -= 20

    p.drawString(50, y, f"Model: {vehicle.model_name}")
    y -= 20

    p.drawString(50, y, f"Year: {vehicle.manufacturing_year}")
    y -= 40
    
    if repair:
         y -= 40

    p.drawString(
        50,
        y,
        f"Total Repair Cost: ₹{repair.total_cost}"
    )
    if prediction:

        p.drawString(
            50,
            y,
            f"Predicted Price: ₹{prediction.predicted_price}"
        )

        y -= 20

        p.drawString(
            50,
            y,
            f"Confidence: {prediction.confidence_score}%"
        )

        y -= 40

    if trust:

        p.drawString(
            50,
            y,
            f"Trust Score: {trust.score}/100"
        )

        y -= 20

        p.drawString(
            50,
            y,
            f"Risk Level: {trust.risk_level}"
        )

        y -= 20

        p.drawString(
            50,
            y,
            f"Recommendation: {trust.recommendation}"
        )

    p.showPage()
    p.save()

    return response

@login_required
def analytics_dashboard(request):

    scores = TrustScore.objects.all()

    data = []

    for score in scores:
        data.append({
            "Vehicle": score.vehicle.brand,
            "Trust Score": score.score
        })

    if len(data) == 0:
        return render(
            request,
            "analytics.html",
            {"chart": "<h2>No Data Available</h2>"}
        )

    df = pd.DataFrame(data)

    fig = px.bar(
        df,
        x="Vehicle",
        y="Trust Score",
        title="Vehicle Trust Score Analysis"
    )

    chart = fig.to_html()

    return render(
        request,
        "analytics.html",
        {"chart": chart}
    )
    
@login_required
def generate_repair_cost(request, pk):

    vehicle = get_object_or_404(
        Vehicle,
        pk=pk
    )

    costs = estimate_repair_cost(vehicle)

    RepairCost.objects.update_or_create(
        vehicle=vehicle,
        defaults={
            "scratch_cost": costs["scratch"],
            "dent_cost": costs["dent"],
            "rust_cost": costs["rust"],
            "broken_light_cost": costs["broken_light"],
            "total_cost": costs["total"]
        }
    )

    return redirect(
        'vehicle_detail',
        pk=vehicle.id
    )