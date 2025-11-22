import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ProfileData {
  id?: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  profileImageUrl: string;
  role?: string;
}

export default function Profile() {
  const { token, isAuthenticated, user, setAuth } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    profileImageUrl: "",
  });
  const [formData, setFormData] = useState<ProfileData>({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    profileImageUrl: "",
  });

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchProfile();
    }
  }, [isAuthenticated, token]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/accounts/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Failed to fetch profile");

      const profileInfo = data.user;
      setProfileData(profileInfo);
      setFormData(profileInfo);
    } catch (e: any) {
      toast.error("Failed to load profile", { description: e.message });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = e.target?.result as string;
      setFormData((prev) => ({
        ...prev,
        profileImageUrl: base64String,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      setUpdating(true);
      const res = await fetch("/api/accounts/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Failed to update profile");

      toast.success("Profile updated successfully");
      setProfileData(data.user);
      setFormData(data.user);
      setIsEditing(false);

      setAuth(token, data.user);
    } catch (e: any) {
      toast.error("Update failed", { description: e.message });
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    setFormData(profileData);
    setIsEditing(false);
  };

  if (!isAuthenticated) {
    return (
      <section className="container mx-auto px-4 py-16">
        <p className="text-muted-foreground">Please log in to view your profile.</p>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-16">
        <p className="text-muted-foreground">Loading profile...</p>
      </section>
    );
  }

  const initials = profileData.fullName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U";

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">My Profile</h1>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          )}
        </div>

        <div className="rounded-lg border bg-card p-6">
          {/* Profile Picture Section */}
          <div className="mb-8 flex flex-col items-center">
            <Avatar className="w-24 h-24 mb-4">
              <AvatarImage
                src={formData.profileImageUrl || profileData.profileImageUrl}
                alt={profileData.fullName}
              />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            {isEditing && (
              <div>
                <Label htmlFor="profile-image" className="cursor-pointer">
                  <span className="text-sm text-primary hover:underline">
                    Change Photo
                  </span>
                </Label>
                <Input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={updating}
                />
              </div>
            )}
          </div>

          {/* Profile Information */}
          <div className="space-y-6">
            {/* Full Name */}
            <div className="grid gap-2">
              <Label htmlFor="fullName">Full Name</Label>
              {isEditing ? (
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  disabled={updating}
                  placeholder="Enter your full name"
                />
              ) : (
                <p className="text-sm py-2">{profileData.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <p className="text-sm py-2">{profileData.email}</p>
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>

            {/* Phone Number */}
            <div className="grid gap-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              {isEditing ? (
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    handleInputChange("phoneNumber", e.target.value)
                  }
                  disabled={updating}
                  placeholder="Enter your phone number"
                />
              ) : (
                <p className="text-sm py-2">{profileData.phoneNumber}</p>
              )}
            </div>

            {/* Address */}
            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              {isEditing ? (
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  disabled={updating}
                  placeholder="Enter your address"
                />
              ) : (
                <p className="text-sm py-2">
                  {profileData.address || "Not provided"}
                </p>
              )}
            </div>

            {/* City */}
            <div className="grid gap-2">
              <Label htmlFor="city">City</Label>
              {isEditing ? (
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  disabled={updating}
                  placeholder="Enter your city"
                />
              ) : (
                <p className="text-sm py-2">
                  {profileData.city || "Not provided"}
                </p>
              )}
            </div>

            {/* State */}
            <div className="grid gap-2">
              <Label htmlFor="state">State</Label>
              {isEditing ? (
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  disabled={updating}
                  placeholder="Enter your state"
                />
              ) : (
                <p className="text-sm py-2">
                  {profileData.state || "Not provided"}
                </p>
              )}
            </div>

            {/* Pincode */}
            <div className="grid gap-2">
              <Label htmlFor="pincode">Pincode</Label>
              {isEditing ? (
                <Input
                  id="pincode"
                  value={formData.pincode}
                  onChange={(e) => handleInputChange("pincode", e.target.value)}
                  disabled={updating}
                  placeholder="Enter your pincode"
                />
              ) : (
                <p className="text-sm py-2">
                  {profileData.pincode || "Not provided"}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex gap-2 justify-end pt-4">
                <Button
                  variant="secondary"
                  onClick={handleCancel}
                  disabled={updating}
                >
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={updating}>
                  {updating ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
