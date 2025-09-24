'use client';

import { useState } from 'react';
import { useCreateMultiPresaleProject } from '@/hooks/useMultiPresale';
import { ProjectCategory } from '@/lib/types';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Navigation } from '@/components/Navigation';
import { 
  Rocket, 
  Upload, 
  Link as LinkIcon, 
  Check, 
  AlertCircle,
  ArrowLeft, 
  ArrowRight,
  ExternalLink,
  Twitter,
  MessageCircle,
  Send
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { projectCreationSchema, ProjectCategory as ValidationProjectCategory } from '@/lib/validation';

type ProjectFormData = z.infer<typeof projectCreationSchema>;

interface StepProps {
  formData: ProjectFormData;
  updateFormData: (data: Partial<ProjectFormData>) => void;
  errors: any;
  register: any;
}

function Step1BasicInfo({ formData, updateFormData, errors, register }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-mountain-900 mb-2">Project Information</h2>
        <p className="text-mountain-600">Tell us about your project and what makes it special</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-mountain-700 mb-2">
          Project Name *
        </label>
        <input
          {...register('name')}
          type="text"
          placeholder="e.g., DeFi Protocol X"
          className={`w-full px-4 py-3 border rounded-lg bg-white focus:ring-2 focus:ring-sky-400 focus:border-sky-400 ${
            errors.name ? 'border-red-500' : 'border-mountain-300'
          }`}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-mountain-700 mb-2">
          Description *
        </label>
        <textarea
          {...register('description')}
          rows={4}
          placeholder="Describe your project, its goals, and what problem it solves..."
          className={`w-full px-4 py-3 border rounded-lg bg-white focus:ring-2 focus:ring-sky-400 focus:border-sky-400 ${
            errors.description ? 'border-red-500' : 'border-mountain-300'
          }`}
        />
        <p className="mt-1 text-sm text-mountain-500">
          {formData.description?.length || 0}/500 characters
        </p>
        {errors.description && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-mountain-700 mb-2">
          Category *
        </label>
                <select
          {...register('category')}
          className={`w-full px-4 py-3 border rounded-lg bg-white focus:ring-2 focus:ring-sky-400 focus:border-sky-400 ${
            errors.category ? 'border-red-500' : 'border-mountain-300'
          }`}
        >
          <option value="">Select a category</option>
          {Object.values(ValidationProjectCategory).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.category.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-mountain-700 mb-2">
          Target Funding Amount (SOL) *
        </label>
        <input
          {...register('targetAmount', { valueAsNumber: true })}
          type="number"
          step="0.1"
          min="0"
          placeholder="e.g., 1000"
          className={`w-full px-4 py-3 border rounded-lg bg-white focus:ring-2 focus:ring-sky-400 focus:border-sky-400 ${
            errors.targetAmount ? 'border-red-500' : 'border-mountain-300'
          }`}
        />
        {errors.targetAmount && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.targetAmount.message}
          </p>
        )}
      </div>
    </div>
  );
}

function Step2TokenDetails({ formData, updateFormData, errors, register }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-mountain-900 mb-2">Token Information</h2>
        <p className="text-mountain-600">Provide details about your token</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-mountain-700 mb-2">
          Token Mint Address *
        </label>
        <input
          {...register('tokenMint')}
          type="text"
          placeholder="Enter your token mint address"
          className={`w-full px-4 py-3 border rounded-lg bg-white focus:ring-2 focus:ring-sky-400 focus:border-sky-400 font-mono text-sm ${
            errors.tokenMint ? 'border-red-500' : 'border-mountain-300'
          }`}
        />
        {errors.tokenMint && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.tokenMint.message}
          </p>
        )}
        <p className="mt-1 text-sm text-mountain-500">
          This should be the Solana token mint address for your project's token
        </p>
      </div>

      <div className="bg-sky-50 rounded-lg p-4">
        <h3 className="font-medium text-sky-800 mb-2">Token Requirements</h3>
        <ul className="text-sm text-sky-700 space-y-1">
          <li>• Token must be deployed on Solana</li>
          <li>• You must be the mint authority or have sufficient tokens</li>
          <li>• Token metadata is recommended for better display</li>
          <li>• Ensure token has sufficient decimal places for pricing</li>
        </ul>
      </div>
    </div>
  );
}

function Step3SocialLinks({ formData, updateFormData, errors, register }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-mountain-900 mb-2">Social Presence</h2>
        <p className="text-mountain-600">Help investors learn more about your project</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-mountain-700 mb-2">
          <div className="flex items-center">
            <ExternalLink className="w-4 h-4 mr-2" />
            Website
          </div>
        </label>
        <input
          {...register('website')}
          type="url"
          placeholder="https://yourproject.com"
          className={`w-full px-4 py-3 border rounded-lg bg-white focus:ring-2 focus:ring-sky-400 focus:border-sky-400 ${
            errors.website ? 'border-red-500' : 'border-mountain-300'
          }`}
        />
        {errors.website && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.website.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-mountain-700 mb-2">
          <div className="flex items-center">
            <Twitter className="w-4 h-4 mr-2" />
            Twitter
          </div>
        </label>
        <input
          {...register('twitter')}
          type="url"
          placeholder="https://twitter.com/yourproject"
          className={`w-full px-4 py-3 border rounded-lg bg-white focus:ring-2 focus:ring-sky-400 focus:border-sky-400 ${
            errors.twitter ? 'border-red-500' : 'border-mountain-300'
          }`}
        />
        {errors.twitter && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.twitter.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-mountain-700 mb-2">
          <div className="flex items-center">
            <MessageCircle className="w-4 h-4 mr-2" />
            Discord
          </div>
        </label>
        <input
          {...register('discord')}
          type="url"
          placeholder="https://discord.gg/yourproject"
          className={`w-full px-4 py-3 border rounded-lg bg-white focus:ring-2 focus:ring-sky-400 focus:border-sky-400 ${
            errors.discord ? 'border-red-500' : 'border-mountain-300'
          }`}
        />
        {errors.discord && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.discord.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-mountain-700 mb-2">
          <div className="flex items-center">
            <Send className="w-4 h-4 mr-2" />
            Telegram
          </div>
        </label>
        <input
          {...register('telegram')}
          type="url"
          placeholder="https://t.me/yourproject"
          className={`w-full px-4 py-3 border rounded-lg bg-white focus:ring-2 focus:ring-sky-400 focus:border-sky-400 ${
            errors.telegram ? 'border-red-500' : 'border-mountain-300'
          }`}
        />
        {errors.telegram && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.telegram.message}
          </p>
        )}
      </div>

      <div className="bg-cream-50 rounded-lg p-4">
        <p className="text-sm text-mountain-600">
          Social links are optional but recommended. They help build trust with potential investors
          and provide ways for your community to stay updated on project progress.
        </p>
      </div>
    </div>
  );
}

function Step4Review({ formData, errors }: { formData: ProjectFormData; errors: any }) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-mountain-900 mb-2">Review & Submit</h2>
        <p className="text-mountain-600">Please review all information before submitting</p>
      </div>

      <div className="bg-white border border-mountain-200 rounded-xl p-6 space-y-4">
        <div>
          <h3 className="font-semibold text-mountain-900 mb-2">Project Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-mountain-600">Name:</span>
              <p className="font-medium">{formData.name}</p>
            </div>
            <div>
              <span className="text-mountain-600">Category:</span>
              <p className="font-medium">{formData.category}</p>
            </div>
            <div className="md:col-span-2">
              <span className="text-mountain-600">Description:</span>
              <p className="font-medium">{formData.description}</p>
            </div>
            <div>
              <span className="text-mountain-600">Target Amount:</span>
              <p className="font-medium">{formData.targetAmount} SOL</p>
            </div>
          </div>
        </div>

        <div className="border-t border-mountain-200 pt-4">
          <h3 className="font-semibold text-mountain-900 mb-2">Token Details</h3>
          <div className="text-sm">
            <div>
              <span className="text-mountain-600">Token Mint:</span>
              <p className="font-mono text-xs break-all">{formData.tokenMint}</p>
            </div>
          </div>
        </div>

        {(formData.website || formData.twitter || formData.discord || formData.telegram) && (
          <div className="border-t border-mountain-200 pt-4">
            <h3 className="font-semibold text-mountain-900 mb-2">Social Links</h3>
            <div className="space-y-2 text-sm">
              {formData.website && (
                <div className="flex items-center">
                  <ExternalLink className="w-4 h-4 mr-2 text-mountain-500" />
                  <a href={formData.website} target="_blank" rel="noopener noreferrer" 
                     className="text-sky-600 hover:text-sky-700">
                    {formData.website}
                  </a>
                </div>
              )}
              {formData.twitter && (
                <div className="flex items-center">
                  <Twitter className="w-4 h-4 mr-2 text-mountain-500" />
                  <a href={formData.twitter} target="_blank" rel="noopener noreferrer" 
                     className="text-sky-600 hover:text-sky-700">
                    {formData.twitter}
                  </a>
                </div>
              )}
              {formData.discord && (
                <div className="flex items-center">
                  <MessageCircle className="w-4 h-4 mr-2 text-mountain-500" />
                  <a href={formData.discord} target="_blank" rel="noopener noreferrer" 
                     className="text-sky-600 hover:text-sky-700">
                    {formData.discord}
                  </a>
                </div>
              )}
              {formData.telegram && (
                <div className="flex items-center">
                  <Send className="w-4 h-4 mr-2 text-mountain-500" />
                  <a href={formData.telegram} target="_blank" rel="noopener noreferrer" 
                     className="text-sky-600 hover:text-sky-700">
                    {formData.telegram}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
          <div className="text-sm text-yellow-800">
            <p className="font-medium mb-1">Important Notes:</p>
            <ul className="space-y-1">
              <li>• Your project will be submitted for review</li>
              <li>• Approval typically takes 1-3 business days</li>
              <li>• You'll be notified via wallet when approved</li>
              <li>• You can then configure sale rounds</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CreateProjectPage() {
  const { connected } = useWallet();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const createProject = useCreateMultiPresaleProject();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid }
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectCreationSchema),
    mode: 'onChange'
  });

  const formData = watch();

  const updateFormData = (data: Partial<ProjectFormData>) => {
    // This is handled by react-hook-form
  };

  const steps = [
    { number: 1, title: 'Basic Info', component: Step1BasicInfo },
    { number: 2, title: 'Token Details', component: Step2TokenDetails },
    { number: 3, title: 'Social Links', component: Step3SocialLinks },
    { number: 4, title: 'Review', component: Step4Review },
  ];

  const getCurrentStepComponent = () => {
    const step = steps.find(s => s.number === currentStep);
    if (!step) return null;
    
    return (
      <step.component
        formData={formData}
        updateFormData={updateFormData}
        errors={errors}
        register={register}
      />
    );
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.description && formData.category && formData.targetAmount;
      case 2:
        return formData.tokenMint && !errors.tokenMint;
      case 3:
        return true; // Social links are optional
      case 4:
        return isValid;
      default:
        return false;
    }
  };

  const onSubmit = async (data: ProjectFormData) => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      return;
    }

    try {
      const result = await createProject.mutateAsync({
        name: data.name,
        description: data.description,
        category: data.category,
        website: data.website || undefined,
        twitter: data.twitter || undefined,
        discord: data.discord || undefined,
        telegram: data.telegram || undefined,
        tokenMint: data.tokenMint,
        targetAmount: data.targetAmount * 1e9, // Convert to lamports
      });

      if (result.success) {
        router.push('/marketplace');
      }
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  if (!connected) {
    return (
      <div className="min-h-screen bg-gradient-landscape">
        <Navigation />
        <div className="pt-24 pb-12">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <h1 className="text-3xl font-bold text-mountain-900 mb-6">
                Connect Your Wallet
              </h1>
              <p className="text-mountain-600 mb-8">
                You need to connect your wallet to create a project.
              </p>
              <WalletMultiButton className="!bg-sky-600 hover:!bg-sky-700 !text-white !font-medium !px-6 !py-3 !rounded-lg !transition-colors" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-landscape">
      <Navigation />
      
      {/* Header */}
      <div className="pt-24 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Launch Your Project
            </h1>
            <p className="text-xl text-white/90">
              Create a multi-round token sale to raise funds for your project
            </p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-semibold
                    ${currentStep >= step.number 
                      ? 'bg-sky-600 text-white' 
                      : 'bg-mountain-200 text-mountain-600'
                    }
                  `}>
                    {currentStep > step.number ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${
                      currentStep >= step.number ? 'text-mountain-900' : 'text-mountain-500'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-12 h-0.5 mx-4 ${
                      currentStep > step.number ? 'bg-sky-600' : 'bg-mountain-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="pb-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit(onSubmit)}>
              {getCurrentStepComponent()}
              
              {/* Navigation Buttons */}
              <div className="flex justify-between pt-8 border-t border-mountain-200 mt-8">
                <button
                  type="button"
                  onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : router.back()}
                  className="flex items-center px-6 py-3 text-mountain-600 hover:text-mountain-800 font-medium transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {currentStep > 1 ? 'Previous' : 'Cancel'}
                </button>
                
                <button
                  type="submit"
                  disabled={!canProceedToNext() || createProject.isPending}
                  className="flex items-center px-6 py-3 bg-sky-600 hover:bg-sky-700 disabled:bg-mountain-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                >
                  {createProject.isPending ? (
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : currentStep < 4 ? (
                    <>
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    'Create Project'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}