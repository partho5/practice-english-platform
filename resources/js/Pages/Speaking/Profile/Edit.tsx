import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import { SpeakingProfile, ContactLink, ProfileFormData, CompletionData } from '@/types/Speaking/Profile';
import ProfileForm from '@/Components/Speaking/Profile/ProfileForm';
import ProfileCompletion from '@/Components/Speaking/Profile/ProfileCompletion';

interface ProfileEditPageProps extends PageProps {
  profile?: SpeakingProfile;
  contactLinks?: ContactLink[];
  completionData?: CompletionData;
  initialData?: any;
  status?: string;
}

export default function ProfileEdit({ profile, contactLinks, completionData, initialData, status }: ProfileEditPageProps) {
  const handleSubmit = (data: ProfileFormData) => {
    // Handle form submission
    console.log('Profile data:', data);
    // TODO: Implement actual form submission
  };

  return (
    <>
      <Head title="Edit Profile - Speaking Practice" />

      <div className="min-h-screen bg-gray-50 py-8 ">
        <div className="max-w-4xl mx-auto px-2 sm:px-2 lg:px-8">
            <div>
                <a href="/">⬅Home</a>
            </div>
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {profile ? 'Edit Your Profile' : 'Complete Your Profile'}
            </h1>
            <p className="mt-2 text-gray-600">
              {profile
                ? 'Update your speaking practice profile to help others connect with you.'
                : 'Create your speaking practice profile to start finding partners and improving your English.'
              }
            </p>
          </div>

          {/* Status Message */}
          {status && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-800">{status}</p>
            </div>
          )}

          {/* Profile Completion */}
          {completionData && (
            <ProfileCompletion completionData={completionData} />
          )}

          {/* Profile Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <ProfileForm
              initialData={initialData || {}}
              onSubmit={handleSubmit}
              isLoading={false}
            />
          </div>

          {/* Help Section */}
          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-blue-900 mb-2">
              Need Help?
            </h3>
            <p className="text-blue-800 mb-4">
              Here are some tips to create a great profile:
            </p>
            <ul className="text-blue-700 space-y-2">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Be honest about your skill level - it helps others find compatible partners</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Add a clear career plan to show your goals and motivation</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Include your interests to help others connect with you</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Add at least one contact method so others can reach you</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Profile pictures and voice introductions make your profile more engaging</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
