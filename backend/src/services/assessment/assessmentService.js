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
    .populate("businessCategory", "name sector")
    .populate("location", "village block district state")
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
  return Assessment.findOneAndUpdate(
    {
      _id: assessmentId,
      user: userId,
    },
    {
      $set: data,
    },
    {
      new: true,
      runValidators: true,
    }
  );
}