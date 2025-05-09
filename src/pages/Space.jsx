import { useState, useEffect } from 'react';
import {
  PlusCircle,
  Trash2,
  UserPlus,
  Users,
  Home,
  Briefcase,
  Plane,
  Edit,
  ChevronRight,
} from 'lucide-react';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db, auth } from '../components/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

const Space = () => {
  const [user] = useAuthState(auth);
  const [spaceName, setSpaceName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [spaces, setSpaces] = useState([]);
  const [activeSpace, setActiveSpace] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [activeTab, setActiveTab] = useState('spaces');
  const [invites, setInvites] = useState([]);
  const [selectedSpace, setSelectedSpace] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchSpaces = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'spaces'), where('members', 'array-contains', user.email));
        const querySnapshot = await getDocs(q);
        const spacesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setSpaces(spacesData);

        if (!activeSpace) {
          const personalSpace = {
            id: 'personal',
            name: 'Personal',
            members: [user.email],
            createdBy: user.email,
          };
          setActiveSpace(personalSpace);
          setSelectedSpace(personalSpace);
        }
      } catch (err) {
        setError('Failed to fetch spaces');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchInvites = async () => {
      try {
        const invitesQuery = query(
          collection(db, 'invites'),
          where('inviteeEmail', '==', user.email),
          where('status', '==', 'pending')
        );
        const querySnapshot = await getDocs(invitesQuery);
        const invitesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setInvites(invitesData);
      } catch (err) {
        console.error('Failed to fetch invites:', err);
      }
    };

    fetchSpaces();
    fetchInvites();
  }, [user, activeSpace]);

  const handleCreateSpace = async (e) => {
    e.preventDefault();
    if (!spaceName.trim() || !user) return;

    setLoading(true);
    setError('');
    try {
      const newSpace = {
        name: spaceName,
        createdBy: user.email,
        members: [user.email],
        expenses: [],
        createdAt: new Date().toISOString(),
      };
      const docRef = await addDoc(collection(db, 'spaces'), newSpace);
      const createdSpace = { id: docRef.id, ...newSpace };
      setSpaces([...spaces, createdSpace]);
      setActiveSpace(createdSpace);
      setSelectedSpace(createdSpace);
      setSpaceName('');
      setShowCreateModal(false);
    } catch (err) {
      setError('Failed to create space');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async () => {
    if (!memberEmail.trim() || !activeSpace || activeSpace.id === 'personal') return;

    setLoading(true);
    setError('');
    try {
      if (activeSpace.members.includes(memberEmail)) {
        setError('User already a member');
        setLoading(false);
        return;
      }

      const spaceRef = doc(db, 'spaces', activeSpace.id);
      await updateDoc(spaceRef, {
        members: arrayUnion(memberEmail),
      });

      await addDoc(collection(db, 'invites'), {
        spaceId: activeSpace.id,
        spaceName: activeSpace.name,
        inviterEmail: user.email,
        inviteeEmail: memberEmail,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });

      const updated = {
        ...activeSpace,
        members: [...activeSpace.members, memberEmail],
      };
      setActiveSpace(updated);
      setSelectedSpace(updated);
      setSpaces(spaces.map((s) => (s.id === updated.id ? updated : s)));
      setMemberEmail('');
      setShowAddMemberModal(false);
    } catch (err) {
      setError('Failed to add member');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (email) => {
    if (!activeSpace || email === user.email || activeSpace.id === 'personal') return;

    setLoading(true);
    setError('');
    try {
      const spaceRef = doc(db, 'spaces', activeSpace.id);
      await updateDoc(spaceRef, {
        members: arrayRemove(email),
      });
      const updated = {
        ...activeSpace,
        members: activeSpace.members.filter((m) => m !== email),
      };
      setActiveSpace(updated);
      setSelectedSpace(updated);
      setSpaces(spaces.map((s) => (s.id === updated.id ? updated : s)));
    } catch (err) {
      setError('Failed to remove member');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInviteResponse = async (inviteId, response) => {
    setLoading(true);
    setError('');
    try {
      const inviteRef = doc(db, 'invites', inviteId);
      await updateDoc(inviteRef, {
        status: response ? 'accepted' : 'declined',
        respondedAt: new Date().toISOString(),
      });

      if (response) {
        const invite = invites.find((i) => i.id === inviteId);
        const spaceRef = doc(db, 'spaces', invite.spaceId);
        await updateDoc(spaceRef, {
          members: arrayUnion(user.email),
        });

        const q = query(collection(db, 'spaces'), where('members', 'array-contains', user.email));
        const querySnapshot = await getDocs(q);
        const spacesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setSpaces(spacesData);
      }

      setInvites(invites.filter((i) => i.id !== inviteId));
    } catch (err) {
      setError('Failed to process invite response');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getSpaceIcon = (name) => {
    const lower = name.toLowerCase();
    if (lower.includes('home')) return <Home size={18} className="text-purple-400" />;
    if (lower.includes('work') || lower.includes('office'))
      return <Briefcase size={18} className="text-blue-400" />;
    if (lower.includes('trip') || lower.includes('vacation'))
      return <Plane size={18} className="text-green-400" />;
    return <Users size={18} className="text-yellow-400" />;
  };

  const handleSpaceSelect = (space) => {
    setSelectedSpace(space);
    setActiveSpace(space);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Please sign in to access spaces</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#DFDFDF] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500 text-white rounded-lg">{error}</div>
        )}

        {/* Tabs */}
        <div className="flex space-x-8 mb-8 border-b border-[#333]">
          <button
            className={`pb-3 ${
              activeTab === 'spaces' ? 'border-b-2 border-purple-500 text-white' : 'text-[#888]'
            }`}
            onClick={() => setActiveTab('spaces')}
          >
            <span className="text-lg">Spaces</span>
          </button>
          <button
            className={`pb-3 ${
              activeTab === 'invites' ? 'border-b-2 border-purple-500 text-white' : 'text-[#888]'
            }`}
            onClick={() => setActiveTab('invites')}
          >
            <span className="text-lg">Invites</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'spaces' ? (
          <div className="flex gap-8">
            {/* Spaces List */}
            <div className="w-1/3">
              <div className="space-y-3">
                {/* Personal Space */}
                <div
                  className={`p-4 rounded-lg cursor-pointer ${
                    selectedSpace?.id === 'personal' ? 'bg-[#333]' : 'bg-[#1A1A1A] hover:bg-[#222]'
                  }`}
                  onClick={() =>
                    handleSpaceSelect({
                      id: 'personal',
                      name: 'Personal',
                      members: [user.email],
                      createdBy: user.email,
                    })
                  }
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Home size={20} className="text-purple-400" />
                      <div>
                        <h3 className="font-medium">Personal</h3>
                        <p className="text-sm text-gray-400">Members 1</p>
                      </div>
                    </div>
                    {selectedSpace?.id === 'personal' && <ChevronRight size={18} />}
                  </div>
                </div>

                {/* Other Spaces */}
                {loading ? (
                  <p>Loading spaces...</p>
                ) : (
                  spaces.map((space) => (
                    <div
                      key={space.id}
                      className={`p-4 rounded-lg cursor-pointer ${
                        selectedSpace?.id === space.id ? 'bg-[#333]' : 'bg-[#1A1A1A] hover:bg-[#222]'
                      }`}
                      onClick={() => handleSpaceSelect(space)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getSpaceIcon(space.name)}
                          <div>
                            <h3 className="font-medium">{space.name}</h3>
                            <p className="text-sm text-gray-400">Members {space.members.length}</p>
                          </div>
                        </div>
                        {selectedSpace?.id === space.id && <ChevronRight size={18} />}
                      </div>
                    </div>
                  ))
                )}

                {/* Create New Space */}
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="w-full p-4 rounded-lg bg-[#1A1A1A] hover:bg-[#222] text-purple-400 flex items-center space-x-3"
                  disabled={loading}
                >
                  <PlusCircle size={20} />
                  <span>Create new Space</span>
                </button>
              </div>
            </div>

            {/* Space Details */}
            <div className="flex-1">
              {selectedSpace ? (
                <div className="bg-[#1A1A1A] rounded-xl p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold flex items-center space-x-3">
                      {getSpaceIcon(selectedSpace.name)}
                      <span>{selectedSpace.name}</span>
                    </h1>
                    {selectedSpace.id !== 'personal' && (
                      <div className="flex gap-3">
                        <button
                          className="px-4 py-2 bg-[#333] text-white rounded-lg hover:bg-[#444] flex items-center space-x-2"
                          disabled={loading}
                        >
                          <Edit size={16} />
                          <span>Edit</span>
                        </button>
                        <button
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                          disabled={loading}
                        >
                          Switch
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="mb-8">
                    <h3 className="text-lg font-medium mb-4">Members</h3>
                    <div className="space-y-3">
                      {selectedSpace.members.map((email) => (
                        <div
                          key={email}
                          className="flex justify-between items-center p-3 bg-[#333] rounded-lg"
                        >
                          <span>{email}</span>
                          {email !== user.email && selectedSpace.id !== 'personal' && (
                            <button
                              onClick={() => handleRemoveMember(email)}
                              className="text-red-500 hover:text-red-400"
                              disabled={loading}
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedSpace.id !== 'personal' && (
                    <button
                      onClick={() => setShowAddMemberModal(true)}
                      className="w-full py-3 bg-[#333] text-white rounded-lg hover:bg-[#444] flex items-center justify-center space-x-2"
                      disabled={loading}
                    >
                      <UserPlus size={16} />
                      <span>Add Member</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center mt-24">
                  <h2 className="text-2xl font-semibold mb-3">No space selected</h2>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600"
                    disabled={loading}
                  >
                    <PlusCircle className="inline-block mr-2" size={18} />
                    Create Your First Space
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {invites.length === 0 ? (
              <p className="text-center text-gray-400 py-8">No invitations found.</p>
            ) : (
              invites.map((invite) => (
                <div
                  key={invite.id}
                  className="bg-[#1A1A1A] p-4 rounded-xl flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">{invite.spaceName}</p>
                    <p className="text-sm text-gray-400">Invited by {invite.inviterEmail}</p>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleInviteResponse(invite.id, true)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      disabled={loading}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleInviteResponse(invite.id, false)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      disabled={loading}
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Create Space Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-[#1A1A1A] p-6 rounded-xl w-[400px]">
            <h3 className="text-xl font-semibold mb-4">Create a Space</h3>
            <input
              type="text"
              value={spaceName}
              onChange={(e) => setSpaceName(e.target.value)}
              placeholder="Enter space name"
              className="w-full px-4 py-2 bg-[#333] text-white rounded-lg mb-4"
              disabled={loading}
            />
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="flex justify-between space-x-4">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setSpaceName('');
                  setError('');
                }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSpace}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-[#1A1A1A] p-6 rounded-xl w-[400px]">
            <h3 className="text-xl font-semibold mb-4">Add Member to Space</h3>
            <input
              type="email"
              value={memberEmail}
              onChange={(e) => setMemberEmail(e.target.value)}
              placeholder="Enter member's email"
              className="w-full px-4 py-2 bg-[#333] text-white rounded-lg mb-4"
              disabled={loading}
            />
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="flex justify-between space-x-4">
              <button
                onClick={() => {
                  setShowAddMemberModal(false);
                  setMemberEmail('');
                  setError('');
                }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleAddMember}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Space;