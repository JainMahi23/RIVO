import Assessment from "../../models/Assessment.js";

export async function createAssessment(userId, data) {
  const assessment = await Assessment.create({
    user: userId,
    businessCategory: data.businessCategory,
    location: data.location,
    personalInfo: data.personalInfo,
    businessInfo: data.businessInfo,
    financialInput: data.financialInput,
    status: "DRAFT",
  });

  return assessment;
}

export async function getUserAssessments(userId) {
  return Assessment.find({
    user: userId,
  })
    .populate("businessCategory", "name sector slug")
    .populate("location", "village subDistrict district state pincode")
    .sort({ createdAt: -1 });
}

export async function getUserAssessmentById(userId, assessmentId) {
  return Assessment.findOne({
    _id: assessmentId,
    user: userId,
  })
    .populate("businessCategory")
    .populate("location");
}

export async function updateUserAssessment(userId, assessmentId, data) {
  // Prevent overwriting critical fields
  const { user, _id, status, ...safeData } = data;

  return Assessment.findOneAndUpdate(
    {
      _id: assessmentId,
      user: userId,
      status: { $in: ["DRAFT", "SUBMITTED"] },
    },
    {
      $set: safeData,
    },
    {
      new: true,
      runValidators: true,
    }
  );
}

export async function deleteUserAssessment(userId, assessmentId) {
  return Assessment.findOneAndDelete({
    _id: assessmentId,
    user: userId,
  });
}

export async function submitAssessment(userId, assessmentId) {
  return Assessment.findOneAndUpdate(
    {
      _id: assessmentId,
      user: userId,
      status: "DRAFT",
    },
    {
      $set: { status: "SUBMITTED" },
    },
    {
      new: true,
    }
  );
}