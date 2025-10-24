<?php

namespace App\Http\Requests\Speaking;

use Illuminate\Foundation\Http\FormRequest;

class ContactLinksRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'contact_links' => 'required|array|min:1',
            'contact_links.*.platform' => 'required|in:facebook,whatsapp,telegram,email',
            'contact_links.*.value' => 'required|string|max:255',
            'contact_links.*.is_public' => 'boolean',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'contact_links' => 'contact links',
            'contact_links.*.platform' => 'platform',
            'contact_links.*.value' => 'value',
            'contact_links.*.is_public' => 'public visibility',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'contact_links.required' => 'Please provide at least one contact link.',
            'contact_links.min' => 'Please provide at least one contact link.',
            'contact_links.*.platform.required' => 'Please select a platform.',
            'contact_links.*.platform.in' => 'Please select a valid platform.',
            'contact_links.*.value.required' => 'Please enter the contact value.',
            'contact_links.*.value.max' => 'The contact value must not exceed 255 characters.',
        ];
    }
}
