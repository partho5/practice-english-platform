import {useState, useRef, useEffect} from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { router } from '@inertiajs/react';
import { ProfileFormData, PracticePurpose, SkillLevel } from '@/types/Speaking/Profile';

// File upload configuration
const FILE_CONFIG = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedAudioFormats: ['mp3', 'wav', 'm4a', 'aac', 'ogg'],
  allowedImageFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
};

// Validation schema
const profileSchema = z.object({
  // Step 1: Basic Information
  purpose_of_practice: z.enum(['IELTS', 'TOEFL', 'Fluency', 'Other']),
  skill_level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  expected_score: z.string().optional(),
  career_plan: z.string().min(10, 'Career plan must be at least 10 characters'),
  profile_picture: z.any().optional(),
  voice_intro_file: z.any().optional(),
  youtube_video_url: z.string().url().optional().or(z.literal('')),

  // Step 2: Education & Contact
  education: z.string().min(1, 'Education is required'),
  institution: z.string().min(1, 'Institution is required'),
  whatsapp: z.string().optional(),
  telegram: z.string().optional(),
  facebook: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),

  // Step 3: Interests
  interests: z.string().optional(),
}).refine((data) => {
  // At least one contact method required
  return data.whatsapp || data.telegram || data.facebook || data.email;
}, {
  message: "At least one contact method is required",
  path: ["contact_required"]
});

interface ProfileFormProps {
  initialData?: Partial<ProfileFormData>;
  onSubmit: (data: ProfileFormData) => void;
  isLoading?: boolean;
}

interface FileUploadState {
  profile_picture: { file: File | null; progress: number; uploading: boolean };
  voice_intro_file: { file: File | null; progress: number; uploading: boolean };
}

export default function ProfileForm({ initialData, onSubmit, isLoading = false }: ProfileFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [fileUploads, setFileUploads] = useState<FileUploadState>({
    profile_picture: { file: null, progress: 0, uploading: false },
    voice_intro_file: { file: null, progress: 0, uploading: false },
  });

  const profilePictureRef = useRef<HTMLInputElement>(null);
  const voiceIntroRef = useRef<HTMLInputElement>(null);

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      purpose_of_practice: 'IELTS',
      skill_level: 'Intermediate',
      expected_score: '',
      career_plan: 'I am planning to move to USA',
      profile_picture: null,
      voice_intro_file: null,
      youtube_video_url: '',
      education: '',
      institution: '',
      whatsapp: '',
      telegram: '',
      facebook: '',
      email: '',
      interests: '',
      ...initialData,
    },
  });

    const [previewUrl, setPreviewUrl] = useState<string | null>(
        initialData?.profile_picture || null
    );

    useEffect(() => {
        //console.log(initialData)
    }, [previewUrl]);

  const steps = [
    {
      title: 'Basic Information',
      fields: ['purpose_of_practice', 'skill_level', 'expected_score', 'career_plan', 'profile_picture', 'voice_intro_file', 'youtube_video_url'],
    },
    {
      title: 'Education & Contact',
      fields: ['education', 'institution', 'whatsapp', 'telegram', 'facebook', 'email'],
    },
    {
      title: 'Interests',
      fields: ['interests'],
    },
  ];

  // File upload handlers
  const handleFileChange = (field: 'profile_picture' | 'voice_intro_file', file: File | null) => {
    if (file) {
      // Validate file size
      if (file.size > FILE_CONFIG.maxFileSize) {
        alert(`File size must be less than ${FILE_CONFIG.maxFileSize / (1024 * 1024)}MB`);
        return;
      }

      // Validate file format
      const extension = file.name.split('.').pop()?.toLowerCase();
      const allowedFormats = field === 'profile_picture'
        ? FILE_CONFIG.allowedImageFormats
        : FILE_CONFIG.allowedAudioFormats;

      if (!extension || !allowedFormats.includes(extension)) {
        alert(`Invalid file format. Allowed formats: ${allowedFormats.join(', ')}`);
        return;
      }

      if(field === 'profile_picture'){
          // Create a temporary preview URL
          const previewUrl = URL.createObjectURL(file);
          setPreviewUrl(previewUrl);
      }


      setFileUploads(prev => ({
        ...prev,
        [field]: { ...prev[field], file, progress: 0, uploading: false }
      }));

      form.setValue(field, file);
    }
  };

  const uploadFile = async (field: 'profile_picture' | 'voice_intro_file'): Promise<string | null> => {
    const fileData = fileUploads[field];
    if (!fileData.file) return null;

    setFileUploads(prev => ({
      ...prev,
      [field]: { ...prev[field], uploading: true, progress: 0 }
    }));

    try {
      const formData = new FormData();
      formData.append(field, fileData.file);
      formData.append('step', currentStep.toString());

      const response = await fetch(route('speaking.profile.update'), {
        method: 'POST',
        body: formData,
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      return result.file_url || null;
    } catch (error) {
      console.error('File upload error:', error);
      return null;
    } finally {
      setFileUploads(prev => ({
        ...prev,
        [field]: { ...prev[field], uploading: false, progress: 100 }
      }));
    }
  };

  const handleSaveAndNext = async () => {
    setIsSaving(true);

    try {
      // Validate current step
      const currentStepData = form.getValues();
      //console.log(currentStepData);


      // @ts-ignore
      let isValid = await form.trigger(steps[currentStep].fields);
      console.log(steps[currentStep].fields);

        // Additional validation for step 1 (contact methods)
      if (currentStep === 1) {
            const { whatsapp, telegram, facebook, email } = currentStepData;
            const hasContact = whatsapp || telegram || facebook || email;

            if (!hasContact) {
                alert('At least one contact method is required')
                // @ts-ignore
                form.setError('contact_required', {
                    type: 'manual',
                    message: 'At least one contact method is required'
                });
                isValid = false;
            } else {
                // @ts-ignore
                form.clearErrors('contact_required');
            }
      }

        //console.log(isValid)


        if (!isValid) {
        setIsSaving(false);
        return;
      }

      // Upload files if any
      let profilePictureUrl = null;
      let voiceIntroUrl = null;

        // Only show error if both new upload and existing file are missing
        if(! fileUploads.voice_intro_file.file && !initialData?.voice_intro_url){
          console.log('initialData?.voice_intro_url', initialData?.voice_intro_url);
          //console.log('voiceIntroUrl missing !');
          alert('Please upload a sample audio of your English speaking')
          setIsSaving(false);
          return;
      }

      if (fileUploads.profile_picture.file) {
        profilePictureUrl = await uploadFile('profile_picture');
      }

      if (fileUploads.voice_intro_file.file) {
        voiceIntroUrl = await uploadFile('voice_intro_file');
      }

      // Prepare data for current step
      const stepData = {
        step: currentStep,
        ...currentStepData,
        profile_picture_url: profilePictureUrl,
        voice_intro_url: voiceIntroUrl,
      };

      // Save current step
      router.post(route('speaking.profile.update'), stepData, {
        onSuccess: () => {
          if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
          } else {
            // Final step completed
            onSubmit(currentStepData as ProfileFormData);
          }
        },
        onError: (errors) => {
          console.error('Save error:', errors);
        },
        onFinish: () => {
          setIsSaving(false);
        }
      });

    } catch (error) {
      console.error('Save error:', error);
      setIsSaving(false);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (data: any) => {
    onSubmit(data);
  };

  const currentStepFields = steps[currentStep].fields;

  return (
    <div className="max-w-2xl mx-auto p-0 sm:p-2">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Form Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {steps[currentStep].title}
        </h2>
        <p className="text-gray-600">
          {currentStep === 0 && "Tell us about your English learning goals, career plans, and add media to make your profile engaging."}
          {currentStep === 1 && "Share your educational background and contact information."}
          {currentStep === 2 && "Add your interests to help others connect with you."}
        </p>
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Step 1: Basic Information */}
        {currentStep === 0 && (
          <div className="space-y-6">
            {/* Purpose of Practice */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Purpose of Practice *
              </label>
              <select
                {...form.register('purpose_of_practice')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="IELTS">IELTS</option>
                <option value="TOEFL">TOEFL</option>
                <option value="Fluency">Fluency (Just want to practice)</option>
                <option value="Other">Other</option>
              </select>
              {form.formState.errors.purpose_of_practice && (
                <p className="mt-1 text-sm text-red-600">
                  {form.formState.errors.purpose_of_practice.message}
                </p>
              )}
            </div>

            {/* Skill Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skill Level *
              </label>
              <select
                {...form.register('skill_level')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              {form.formState.errors.skill_level && (
                <p className="mt-1 text-sm text-red-600">
                  {form.formState.errors.skill_level.message}
                </p>
              )}
            </div>

            {/* Expected Score */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expected Score (optional)
              </label>
              <input
                type="text"
                {...form.register('expected_score')}
                placeholder="Example: 7.5 for IELTS, 95 for TOEFL"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {form.formState.errors.expected_score && (
                <p className="mt-1 text-sm text-red-600">
                  {form.formState.errors.expected_score.message}
                </p>
              )}
            </div>

            {/* Career Plan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Career Plan *
              </label>
              <textarea
                {...form.register('career_plan')}
                rows={4}
                placeholder="Describe your career goals and how English learning fits into your plans..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {form.formState.errors.career_plan && (
                <p className="mt-1 text-sm text-red-600">
                  {form.formState.errors.career_plan.message}
                </p>
              )}
            </div>

            {/* Profile Picture */}
            <div className="border rounded-lg border-green-600 p-2">
              <label className="block text-sm text-center font-medium text-gray-700 mb-2">
                Profile Picture
              </label>
                <div className="flex justify-center ">
                    <img
                        src={previewUrl || "/images/avatar-male.png"}
                        alt="profile photo"
                        className="w-20 h-20 md:w-32 md:h-32 rounded-full object-cover border-2 border-gray-200"
                    />
                </div>
              <input
                ref={profilePictureRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange('profile_picture', e.target.files?.[0] || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
              {fileUploads.profile_picture.uploading && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${fileUploads.profile_picture.progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Uploading...</p>
                </div>
              )}
              <p className="mt-1 text-xs sm:text-sm text-gray-500">
                Upload a profile picture (max 10MB, formats: {FILE_CONFIG.allowedImageFormats.join(', ')})
              </p>
            </div>

            {/* Voice Introduction */}
            <div className="border-2 rounded-lg border-red-600 p-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Voice Introduction *
              </label>
                <div>

                    <audio controls>
                        <source
                            src={initialData?.voice_intro_url || ''}
                            type={`audio/mpeg`}
                        />
                        Your browser did not support the audio.
                    </audio>
                </div>
                <input
                    ref={voiceIntroRef}
                    type="file"
                    accept="audio/*"
                    required={true}
                    onChange={(e) => handleFileChange('voice_intro_file', e.target.files?.[0] || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
              {fileUploads.voice_intro_file.uploading && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${fileUploads.voice_intro_file.progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Uploading...</p>
                </div>
              )}
              <p className="mt-1 text-xs sm:text-sm text-gray-500">
                Upload a <b>1-3 minute</b> voice (max 10MB)
                  <span className="hidden">, formats: {FILE_CONFIG.allowedAudioFormats.join(', ')}</span>
              </p>
            </div>

            {/* YouTube Video URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                YouTube Video URL (optional)
              </label>
              <input
                type="url"
                {...form.register('youtube_video_url')}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* Step 2: Education & Contact */}
        {currentStep === 1 && (
          <div className="space-y-6">
            {/* Education */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Education *
              </label>
              <input
                type="text"
                {...form.register('education')}
                placeholder="Example: Bachelor of Computer Science"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {form.formState.errors.education && (
                <p className="mt-1 text-sm text-red-600">
                  {form.formState.errors.education.message}
                </p>
              )}
            </div>

            {/* Institution */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Institution *
              </label>
              <input
                type="text"
                {...form.register('institution')}
                placeholder="Example: Dhaka University"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {form.formState.errors.institution && (
                <p className="mt-1 text-sm text-red-600">
                  {form.formState.errors.institution.message}
                </p>
              )}
            </div>

            {/* Contact Information */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
              <p className="text-sm text-gray-600 mb-4">
                Add <span className="text-red-500">at least 1 contact method</span> so others can reach you
              </p>

              {/* WhatsApp */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp Number
                </label>
                <input
                  type="text"
                  {...form.register('whatsapp')}
                  placeholder=""
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Telegram */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telegram Link
                </label>
                <input
                  type="text"
                  {...form.register('telegram')}
                  placeholder="Example: @username or +8801234567890"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Facebook */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Facebook Profile Link
                </label>
                <input
                  type="text"
                  {...form.register('facebook')}
                  placeholder="Example: facebook.com/username"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  {...form.register('email')}
                  placeholder="Example: name@gmail.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Contact validation error */}
              <div></div>

            </div>
          </div>
        )}

        {/* Step 3: Interests */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interests (optional)
              </label>
              <input
                type="text"
                {...form.register('interests')}
                placeholder="Example: Programming, Research, Reading (comma separated)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                Add your interests to help others connect with you
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="w-full sm:w-auto px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            Previous
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={handleSaveAndNext}
              disabled={isSaving}
              className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                'Save & Next'
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSaveAndNext}
              disabled={isSaving}
              className="w-full sm:w-auto px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Completing...
                </>
              ) : (
                'Complete Profile'
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
