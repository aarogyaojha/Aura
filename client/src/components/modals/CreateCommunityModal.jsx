import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createCommunityAction, clearCommunityError } from "../../redux/actions/communityActions";
import { X, Plus, Info, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const CreateCommunityModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    banner: "",
  });

  const communityError = useSelector((state) => state.community?.communityError);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (communityError) dispatch(clearCommunityError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await dispatch(createCommunityAction(formData, navigate));
    setLoading(false);
    
    if (result?.success) {
      setFormData({ name: "", description: "", banner: "" });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Plus className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Create Community</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {communityError && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm font-medium flex items-center gap-2">
              <X className="h-4 w-4" />
              {communityError}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold flex items-center gap-1.5">
              Community Name
              <Info className="h-3.5 w-3.5 text-muted-foreground" />
            </Label>
            <Input
              id="name"
              placeholder="e.g. photography, tech_talks"
              value={formData.name}
              onChange={handleChange}
              required
              className="h-11 border-gray-200 focus:ring-primary/20"
              maxLength={25}
            />
            <p className="text-[10px] text-muted-foreground">Names must be unique and cannot be changed later.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold">Description</Label>
            <Textarea
              id="description"
              placeholder="Tell people what this community is about..."
              value={formData.description}
              onChange={handleChange}
              required
              className="resize-none min-h-[100px] border-gray-200 focus:ring-primary/20"
              maxLength={200}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="banner" className="text-sm font-semibold flex items-center gap-1.5">
              Banner URL
              <ImageIcon className="h-3.5 w-3.5 text-muted-foreground" />
            </Label>
            <Input
              id="banner"
              placeholder="https://example.com/image.jpg"
              value={formData.banner}
              onChange={handleChange}
              className="h-11 border-gray-200 focus:ring-primary/20"
            />
            <p className="text-[10px] text-muted-foreground">Optional. Leave blank for a default placeholder.</p>
          </div>

          <div className="pt-4 flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-11 border-gray-200 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 h-11 font-bold shadow-lg shadow-primary/20"
            >
              {loading ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCommunityModal;
