import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getServicePreferencesAction,
  updateServicePreferencesAction,
} from "../../redux/actions/adminActions";

const Settings = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const servicePreferences = useSelector(
    (state) => state.admin?.servicePreferences
  );
  const [usePerspectiveAPI, setUsePerspectiveAPI] = useState(false);
  const [
    categoryFilteringServiceProvider,
    setCategoryFilteringServiceProvider,
  ] = useState("");
  const [categoryFilteringRequestTimeout, setCategoryFilteringRequestTimeout] =
    useState(0);

  useEffect(() => {
    dispatch(getServicePreferencesAction());
  }, [dispatch]);

  useEffect(() => {
    if (servicePreferences) {
      setUsePerspectiveAPI(servicePreferences.usePerspectiveAPI);
      setCategoryFilteringServiceProvider(
        servicePreferences.categoryFilteringServiceProvider
      );
      setCategoryFilteringRequestTimeout(
        servicePreferences.categoryFilteringRequestTimeout
      );
      setIsLoading(false);
    }
  }, [servicePreferences]);

  const handleUpdate = async () => {
    setIsUpdating(true);
    setIsSuccess(false);
    try {
      await dispatch(
        updateServicePreferencesAction({
          usePerspectiveAPI,
          categoryFilteringServiceProvider,
          categoryFilteringRequestTimeout,
        })
      );
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading || !servicePreferences) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-5 w-full border border-border rounded-md bg-card text-card-foreground mt-3">
      <h2 className="font-semibold mb-4 border-b border-border pb-2 text-center text-foreground">
        Service Preferences
      </h2>

      {isSuccess && (
        <div className="bg-green-100 text-green-800 p-2 mb-4 rounded">
          Service Preferences updated successfully!
        </div>
      )}

      <div className="flex items-center mb-4">
        <div>Use Perspective API for content moderation</div>
        <div className="ml-auto">
          <input
            className="w-5 h-5 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
            type="checkbox"
            checked={usePerspectiveAPI}
            onChange={(e) => setUsePerspectiveAPI(e.target.checked)}
          />
        </div>
      </div>

      <div className="flex items-center mb-4">
        <div>Category filtering service provider</div>
        <div className="ml-auto">
          <select
            className="bg-background border border-border text-foreground text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
            value={categoryFilteringServiceProvider}
            onChange={(e) =>
              setCategoryFilteringServiceProvider(e.target.value)
            }
          >
            <option value="">Select a provider</option>
            <option value="TextRazor">TextRazor</option>
            <option value="InterfaceAPI">InterfaceAPI</option>
            <option value="ClassifierAPI">ClassifierAPI</option>
            <option value="disabled">Disabled</option>
          </select>
        </div>
      </div>

      <div className="flex items-center mb-4">
        <div>Category filtering request timeout (ms)</div>
        <div className="ml-auto">
          <input
            className="bg-background border border-border text-foreground text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
            type="number"
            value={categoryFilteringRequestTimeout}
            min={0}
            max={500000}
            required
            onChange={(e) => {
              setCategoryFilteringRequestTimeout(e.target.value);
            }}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          onClick={handleUpdate}
          disabled={isUpdating}
        >
          {isUpdating ? "Updating..." : "Update"}
        </button>
      </div>
    </div>
  );
};

export default Settings;
