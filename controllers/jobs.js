const Job = require("../models/Job");
const {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} = require("../errors");
const { StatusCodes } = require("http-status-codes");

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort("createdAt");

  if (!jobs) {
    throw new NotFoundError("No jobs available right now.");
  }
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const getJob = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  const jobList = await Job.find({ createdBy: userId });

  let job = await jobList.filter(
    (item) => item._id.toString() === id.toString()
  );

  if (job.length === 0) {
    throw new NotFoundError(`Job not found with id: ${id}.`);
  }
  res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;

  const job = await Job.create(req.body);

  res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req, res) => {
  const { status, company, position } = req.body;
  const { id } = req.params;
  const { userId } = req.user;
  if (!company || !position) {
    throw new BadRequestError("Company or Position fields cannot be empty");
  }
  const job = await Job.findOneAndUpdate(
    { _id: id, createdBy: userId },
    req.body,
    { new: true, overwrite: false, runValidators: true }
  );
  console.log(job);
  if (!job) {
    throw new NotFoundError(`Job not found with id: ${id}.`);
  }
  res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
  const {
    params: { id: id },
    user: { userId: userId },
  } = req;

  const job = await Job.findOneAndDelete({ _id: id, createdBy: userId });
  if (!job) {
    throw new NotFoundError(`Job not found with id: ${id}.`);
  }
  res.status(StatusCodes.OK).send("Job Deleted");
};

module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob };
