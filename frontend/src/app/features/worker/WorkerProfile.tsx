import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import WorkerLayout from '../../layouts/WorkerLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Checkbox } from '../../components/ui/checkbox';
import { useAuth } from '../../hooks/useAuth';
import { profileService, type UpdateWorkerProfilePayload } from '../../services/api';
import type { SkillCategory, EducationLevel, MaritalStatus } from '../../types';

// ── Language options ──────────────────────────────────────────────────────────

const LANGUAGE_OPTIONS = [
  'Hindi', 'English', 'Bengali', 'Telugu', 'Marathi',
  'Tamil', 'Gujarati', 'Kannada', 'Malayalam', 'Punjabi',
  'Odia', 'Urdu', 'Assamese',
];

// ── Form shape ────────────────────────────────────────────────────────────────

interface WorkerProfileForm {
  // Documents
  aadhaarNumber?: string;
  profilePhotoUrl?: string;

  // Personal
  gender?: string;
  dateOfBirth?: string;
  height?: number;
  weight?: number;
  languagesKnown?: string[];
  education?: EducationLevel;
  maritalStatus?: MaritalStatus;

  // Professional
  skillCategory?: SkillCategory;
  experience?: number;
  expectedSalary?: number;
  aboutYourself?: string;
  previousCompanies?: string;
  certifications?: string;
  availableTimings?: string;
  preferredWorkingRadius?: number;
  canRelocate?: boolean;

  // Family & Emergency
  fatherName?: string;
  motherName?: string;
  emergencyContact?: string;
  emergencyContactNumber?: string;

  // Location
  city?: string;
  state?: string;
  latitude?: number;
  longitude?: number;
}

// ── Section wrapper ───────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function WorkerProfile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
  } = useForm<WorkerProfileForm>({
    defaultValues: { languagesKnown: [], canRelocate: false },
  });

  const { data: existingProfile, isLoading: profileLoading } = useQuery({
    queryKey: ['worker-profile'],
    queryFn: profileService.getWorkerProfile,
    retry: false,
    throwOnError: false,
  });

  // Populate form when profile data arrives (including after page refresh)
  useEffect(() => {
    if (existingProfile) {
      reset({
        // Documents
        aadhaarNumber:   existingProfile.aadhaarNumber ?? '',
        profilePhotoUrl: existingProfile.profilePhotoUrl ?? '',

        // Personal
        gender:        existingProfile.gender ?? undefined,
        dateOfBirth:   existingProfile.dateOfBirth
          ? new Date(existingProfile.dateOfBirth).toISOString().split('T')[0]
          : '',
        height:        existingProfile.height ?? undefined,
        weight:        existingProfile.weight ?? undefined,
        languagesKnown: existingProfile.languagesKnown ?? [],
        education:     existingProfile.education ?? undefined,
        maritalStatus: existingProfile.maritalStatus ?? undefined,

        // Professional
        skillCategory:          existingProfile.skillCategory ?? undefined,
        experience:             existingProfile.experience ?? undefined,
        expectedSalary:         existingProfile.expectedSalary ?? undefined,
        aboutYourself:          existingProfile.aboutYourself ?? '',
        previousCompanies:      existingProfile.previousCompanies ?? '',
        certifications:         existingProfile.certifications ?? '',
        availableTimings:       existingProfile.availableTimings ?? '',
        preferredWorkingRadius: existingProfile.preferredWorkingRadius ?? undefined,
        canRelocate:            existingProfile.canRelocate ?? false,

        // Family & Emergency
        fatherName:             existingProfile.fatherName ?? '',
        motherName:             existingProfile.motherName ?? '',
        emergencyContact:       existingProfile.emergencyContact ?? '',
        emergencyContactNumber: existingProfile.emergencyContactNumber ?? '',

        // Location
        city:  existingProfile.city ?? '',
        state: existingProfile.state ?? '',
      });
    }
  }, [existingProfile, reset]);

  // Toggle a language in/out of the array
  const selectedLanguages = watch('languagesKnown') ?? [];
  const toggleLanguage = (lang: string) => {
    const current = selectedLanguages;
    const updated = current.includes(lang)
      ? current.filter((l) => l !== lang)
      : [...current, lang];
    setValue('languagesKnown', updated);
  };

  const onSubmit = async (data: WorkerProfileForm) => {
    try {
      setLoading(true);
      const payload: UpdateWorkerProfilePayload = {
        ...data,
        height:   data.height   ? Number(data.height)   : undefined,
        weight:   data.weight   ? Number(data.weight)   : undefined,
        experience:             data.experience ? Number(data.experience) : undefined,
        expectedSalary:         data.expectedSalary ? Number(data.expectedSalary) : undefined,
        preferredWorkingRadius: data.preferredWorkingRadius
          ? Number(data.preferredWorkingRadius)
          : undefined,
        // Send empty string as undefined so backend ignores blank optional fields
        profilePhotoUrl:        data.profilePhotoUrl || undefined,
        aboutYourself:          data.aboutYourself || undefined,
        previousCompanies:      data.previousCompanies || undefined,
        certifications:         data.certifications || undefined,
        availableTimings:       data.availableTimings || undefined,
        fatherName:             data.fatherName || undefined,
        motherName:             data.motherName || undefined,
        emergencyContact:       data.emergencyContact || undefined,
        emergencyContactNumber: data.emergencyContactNumber || undefined,
        dateOfBirth:            data.dateOfBirth || undefined,
      };
      await profileService.updateWorker(payload);
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <WorkerLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Manage your professional information
          </p>
        </div>

        {/* Account info (read-only) */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Account Information</CardTitle>
              <Badge
                variant="secondary"
                className="bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300"
              >
                Verification Pending
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={user?.name ?? ''} disabled />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={user?.phone ?? ''} disabled />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Input value={user?.role ?? ''} disabled />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile incomplete warning */}
        {!existingProfile && !profileLoading && (
          <Card className="bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800">
            <CardContent className="p-6">
              <p className="text-sm font-semibold text-orange-800 dark:text-orange-200">
                ⚠ Profile not set up yet
              </p>
              <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                Complete and save your profile below before you can update your location or
                availability.
              </p>
            </CardContent>
          </Card>
        )}

        {/* ── Main form ──────────────────────────────────────────────────────── */}
        {profileLoading ? (
          <Card>
            <CardContent className="py-12 text-center">Loading profile…</CardContent>
          </Card>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {/* ── 1. Documents ─────────────────────────────────────────────── */}
            <Section title="Documents">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="aadhaarNumber">
                    Aadhaar Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="aadhaarNumber"
                    placeholder="12-digit Aadhaar number"
                    maxLength={12}
                    {...register('aadhaarNumber')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profilePhotoUrl">Profile Photo URL</Label>
                  <Input
                    id="profilePhotoUrl"
                    placeholder="https://…"
                    {...register('profilePhotoUrl')}
                  />
                </div>
              </div>
            </Section>

            {/* ── 2. Personal ───────────────────────────────────────────────── */}
            <Section title="Personal Information">
              {/* Photo preview */}
              {watch('profilePhotoUrl') && (
                <div className="flex items-center gap-4">
                  <img
                    src={watch('profilePhotoUrl')}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover border border-neutral-200 dark:border-neutral-700"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Gender */}
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value ?? ''}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MALE">Male</SelectItem>
                          <SelectItem value="FEMALE">Female</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                {/* Date of Birth */}
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input id="dateOfBirth" type="date" {...register('dateOfBirth')} />
                </div>

                {/* Height */}
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="e.g. 165"
                    {...register('height', { valueAsNumber: true })}
                  />
                </div>

                {/* Weight */}
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="e.g. 60"
                    {...register('weight', { valueAsNumber: true })}
                  />
                </div>

                {/* Education */}
                <div className="space-y-2">
                  <Label>Education</Label>
                  <Controller
                    name="education"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value ?? ''}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select education" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NO_FORMAL_EDUCATION">No Formal Education</SelectItem>
                          <SelectItem value="PRIMARY">Primary</SelectItem>
                          <SelectItem value="SECONDARY">Secondary (10th)</SelectItem>
                          <SelectItem value="HIGHER_SECONDARY">Higher Secondary (12th)</SelectItem>
                          <SelectItem value="DIPLOMA">Diploma</SelectItem>
                          <SelectItem value="GRADUATE">Graduate</SelectItem>
                          <SelectItem value="POST_GRADUATE">Post Graduate</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                {/* Marital Status */}
                <div className="space-y-2">
                  <Label>Marital Status</Label>
                  <Controller
                    name="maritalStatus"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value ?? ''}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SINGLE">Single</SelectItem>
                          <SelectItem value="MARRIED">Married</SelectItem>
                          <SelectItem value="DIVORCED">Divorced</SelectItem>
                          <SelectItem value="WIDOWED">Widowed</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              {/* Languages Known */}
              <div className="space-y-2">
                <Label>Languages Known</Label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {LANGUAGE_OPTIONS.map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => toggleLanguage(lang)}
                      className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                        selectedLanguages.includes(lang)
                          ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                          : 'bg-transparent text-neutral-600 dark:text-neutral-400 border-neutral-300 dark:border-neutral-600 hover:border-neutral-500'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            </Section>

            {/* ── 3. Professional ───────────────────────────────────────────── */}
            <Section title="Professional Details">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Skill Category */}
                <div className="space-y-2">
                  <Label>
                    Skill Category <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="skillCategory"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value ?? ''}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your skill" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MAID">Maid</SelectItem>
                          <SelectItem value="COOK">Cook</SelectItem>
                          <SelectItem value="DRIVER">Driver</SelectItem>
                          <SelectItem value="NURSE">Nurse</SelectItem>
                          <SelectItem value="PLUMBER">Plumber</SelectItem>
                          <SelectItem value="ELECTRICIAN">Electrician</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                {/* Experience */}
                <div className="space-y-2">
                  <Label htmlFor="experience">
                    Experience (years) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="experience"
                    type="number"
                    placeholder="e.g. 5"
                    {...register('experience', { valueAsNumber: true })}
                  />
                </div>

                {/* Expected Salary */}
                <div className="space-y-2">
                  <Label htmlFor="expectedSalary">
                    Expected Salary (₹/month) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="expectedSalary"
                    type="number"
                    placeholder="e.g. 15000"
                    {...register('expectedSalary', { valueAsNumber: true })}
                  />
                </div>

                {/* Available Timings */}
                <div className="space-y-2">
                  <Label htmlFor="availableTimings">Available Timings</Label>
                  <Input
                    id="availableTimings"
                    placeholder="e.g. 9am – 6pm, Mon–Sat"
                    {...register('availableTimings')}
                  />
                </div>

                {/* Preferred Working Radius */}
                <div className="space-y-2">
                  <Label htmlFor="preferredWorkingRadius">
                    Preferred Working Radius (km)
                  </Label>
                  <Input
                    id="preferredWorkingRadius"
                    type="number"
                    placeholder="e.g. 10"
                    {...register('preferredWorkingRadius', { valueAsNumber: true })}
                  />
                </div>
              </div>

              {/* Can Relocate */}
              <div className="flex items-center gap-3 pt-1">
                <Controller
                  name="canRelocate"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="canRelocate"
                      checked={!!field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="canRelocate" className="cursor-pointer">
                  I am willing to relocate
                </Label>
              </div>

              {/* About Yourself */}
              <div className="space-y-2">
                <Label htmlFor="aboutYourself">About Yourself</Label>
                <Textarea
                  id="aboutYourself"
                  rows={4}
                  placeholder="Write a short bio describing your skills, attitude, and work style…"
                  {...register('aboutYourself')}
                />
              </div>

              {/* Previous Companies */}
              <div className="space-y-2">
                <Label htmlFor="previousCompanies">Previous Companies / Employers</Label>
                <Textarea
                  id="previousCompanies"
                  rows={3}
                  placeholder="List previous employers or households you have worked with…"
                  {...register('previousCompanies')}
                />
              </div>

              {/* Certifications */}
              <div className="space-y-2">
                <Label htmlFor="certifications">Certifications</Label>
                <Textarea
                  id="certifications"
                  rows={3}
                  placeholder="List any relevant certifications or training programs…"
                  {...register('certifications')}
                />
              </div>
            </Section>

            {/* ── 4. Family & Emergency ─────────────────────────────────────── */}
            <Section title="Family &amp; Emergency Contact">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fatherName">Father's Name</Label>
                  <Input
                    id="fatherName"
                    placeholder="Enter father's name"
                    {...register('fatherName')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="motherName">Mother's Name</Label>
                  <Input
                    id="motherName"
                    placeholder="Enter mother's name"
                    {...register('motherName')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                  <Input
                    id="emergencyContact"
                    placeholder="Enter emergency contact name"
                    {...register('emergencyContact')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyContactNumber">Emergency Contact Number</Label>
                  <Input
                    id="emergencyContactNumber"
                    placeholder="Enter 10-digit mobile number"
                    maxLength={10}
                    {...register('emergencyContactNumber')}
                  />
                </div>
              </div>
            </Section>

            {/* ── 5. Location ───────────────────────────────────────────────── */}
            <Section title="Location">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" placeholder="Enter city" {...register('city')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" placeholder="Enter state" {...register('state')} />
                </div>
              </div>
            </Section>

            {/* Submit */}
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? 'Saving…' : 'Save Profile'}
            </Button>
          </form>
        )}

        {/* Verification status info */}
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Verification Status
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Your profile will be verified by our admin team within 24–48 hours. Once verified,
              you'll be able to receive bookings.
            </p>
          </CardContent>
        </Card>
      </div>
    </WorkerLayout>
  );
}