'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/selects";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/buttons";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/inputs";
import { toast } from "react-hot-toast";
import { useEffect } from "react";

interface Activity {
  type: string;
  amount: number;
  unit: string;
}

const emissionFactors: Record<string, number> = {
  electricity: 0.5,
  diesel: 2.68,
  petrol: 2.31,
  flight: 0.15,
  naturalGas: 2.03,
  coal: 2.86,
  bus: 0.1,
  train: 0.05,
};

const unitOptions: Record<string, string[]> = {
  electricity: ["kWh", "MWh"],
  diesel: ["liters", "gallons"],
  petrol: ["liters", "gallons"],
  flight: ["passenger-km", "miles"],
  naturalGas: ["m3", "cubic feet"],
  coal: ["kg", "tons"],
  bus: ["passenger-km", "miles"],
  train: ["passenger-km", "miles"],
};

const CarbonEmissionCalculator = () => {
  const router = useRouter();
  const { isSignedIn, user } = useUser();

  const [activities, setActivities] = useState<Activity[]>(
    Object.keys(emissionFactors).map((type) => ({
      type,
      amount: 0,
      unit: unitOptions[type][0],
    }))
  );

  const [totalEmissions, setTotalEmissions] = useState<number>(0);
  const [requiredCredits, setRequiredCredits] = useState<number>(0);
  const [creditCost, setCreditCost] = useState<number>(10);
  const [showResults, setShowResults] = useState<boolean>(false);

  useEffect(() => {
    if (!isSignedIn) {
      toast.error("User not logged in. Please log in.");
      router.push("/sign-in");
    }
  }, [isSignedIn, router]);

  const handleActivityChange = (index: number, field: keyof Activity, value: string | number) => {
    const updatedActivities = [...activities];
    updatedActivities[index] = { ...updatedActivities[index], [field]: value };
    setActivities(updatedActivities);
  };

  const calculateEmissions = () => {
    const emissions = activities.reduce((total, activity) => {
      const amount = parseFloat(activity.amount.toString()) || 0;
      return total + amount * (emissionFactors[activity.type] || 0);
    }, 0);

    const totalEmissionsTons = emissions / 1000;
    setTotalEmissions(totalEmissionsTons);
    setRequiredCredits(Math.ceil(totalEmissionsTons));
    setShowResults(true);
  };

  return (
    <div className="container mx-auto my-8 p-8 max-w-5xl bg-white rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold mb-10 text-center text-green-700">
        Carbon Emission Calculator
      </h1>

      {user && (
        <p className="text-center text-sm text-gray-500 mb-6">
          Logged in as <strong>{user.fullName}</strong> ({user.primaryEmailAddress?.emailAddress})
        </p>
      )}

      <p className="text-center text-gray-600 mb-6">
        Calculate your carbon footprint based on energy consumption and travel habits.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {activities.map((activity, index) => (
          <Card key={index} className="border border-green-300 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl text-green-800">
                {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)} Usage
              </CardTitle>
              <CardDescription className="text-green-600">
                Enter the amount of {activity.type} consumed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor={`amount-${index}`} className="text-green-700">
                    Amount
                  </Label>
                  <Input
                    id={`amount-${index}`}
                    type="number"
                    className="border-green-500 focus:ring-green-600"
                    value={activity.amount}
                    onChange={(e) =>
                      handleActivityChange(index, "amount", parseFloat(e.target.value) || 0)
                    }
                    placeholder={`Enter ${activity.type} usage`}
                  />
                </div>
                <div>
                  <Label className="text-green-700">Unit</Label>
                  <Select
                    value={activity.unit}
                    onValueChange={(value: string) => handleActivityChange(index, "unit", value)}
                  >
                    <SelectTrigger className="border-green-500 focus:ring-green-600">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {unitOptions[activity.type].map((unit) => (
                        <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8 border border-green-300 shadow-md p-4">
        <Label htmlFor="credit-cost" className="text-green-700">
          Cost per Carbon Credit (USD)
        </Label>
        <Input
          id="credit-cost"
          type="number"
          className="border-green-500 focus:ring-green-600 mt-2"
          value={creditCost}
          onChange={(e) => setCreditCost(parseFloat(e.target.value) || 0)}
          placeholder="Enter cost per credit"
        />
        <CardFooter>
          <Button
            onClick={calculateEmissions}
            className="w-full text-lg bg-green-600 hover:bg-green-700 text-white mt-4"
          >
            Calculate Emissions
          </Button>
        </CardFooter>
      </Card>

      {showResults && (
        <Card className="mt-8 bg-green-700 text-white shadow-lg p-4">
          <CardHeader>
            <CardTitle className="text-2xl">Results</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl mb-2">Total Emissions: {totalEmissions.toFixed(2)} tCO₂e</p>
            <p className="text-xl mb-2">Required Carbon Credits: {requiredCredits}</p>
            <p className="text-xl">Estimated Cost for Offsetting: ${(requiredCredits * creditCost).toFixed(2)}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CarbonEmissionCalculator;
